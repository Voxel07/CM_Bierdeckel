package orm;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.Map;
import java.util.HashMap;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.core.Response;

import model.Order;
import model.OrderItem;
import model.Product;
import model.Extras;
import utils.IdExtractor;
import test.SocketTest;

@ApplicationScoped
public class ProductOrm {
    
    @Inject
    EntityManager em;

    @Inject
    OrderOrm orderOrm;

    @Inject
    SocketTest socketTest;
    
    public Map<Long,Long> stockHash = new HashMap<>();

    public List<Product> getProductById(Long id) {
        Product product = em.find(Product.class, id);
        List<Product> products = new ArrayList<>();
        if (product != null) {
            products.add(product);
        }
        return products;
    }

    public List<Product> getAllProducts() {
        System.out.println("getAllProducts");
        TypedQuery<Product> query = em.createQuery("SELECT p FROM Product p", Product.class);
        return query.getResultList();
    }

    public List<Product> getProductByCategory(String category)
    {
        // TypedQuery<Product> query = em.createQuery(
        //     "SELECT p FROM Product p " +
        //     "JOIN FETCH p.extras " +
        //     "WHERE p.category = :category", 
        //     Product.class
        // );
        TypedQuery<Product> query = em.createQuery("SELECT p FROM Product p WHERE category =: category", Product.class);
        query.setParameter("category", category);
        return query.getResultList();
    }

    public Long getProductStock(Long productId)
    {
        TypedQuery<Long> query = em.createQuery("SELECT stock from Product p WHERE id =: productId", Long.class);
        query.setParameter("productId", productId);
        try {
            return query.getSingleResult();
        } catch (Exception e) {
            return -1L;
        }
    }

    public Response updateProductStock(Long  productId, String action)
    {
        // if id is new add it to the cache
        if(!stockHash.containsKey(productId))
        {
            Long stock = getProductStock(productId);
            if (stock == -1)
            {
                return Response.status(500).entity("Invalide Product").build();
            }
            stockHash.put(productId, stock);
        }
        else
        {
            //TODO: Add boundaries
            if (action.equals("inc")) {
                stockHash.put(productId, stockHash.get(productId)+1);
                socketTest.broadcast(stockHash.toString());
            }
            else if(action.equals("dec")) {
                stockHash.put(productId, stockHash.get(productId)-1);
            }
            else if(action.equals("get")) {
            }
            else if(action.equals("clear")) {
                stockHash.clear();
            }
            else{
                return Response.status(500).entity("Invalide Action").build();
            }
        }
        
        return Response.status(200).entity(stockHash).build();
    }
   
    @Transactional
    public Response createProduct(Product product) {

        TypedQuery<Long> query = em.createQuery("SELECT COUNT(p) FROM Product p WHERE p.name = :productName", Long.class);
        System.out.println(product.getName());
        query.setParameter("productName", product.getName());

        if (query.getSingleResult() != 0L)
        {
            return Response.status(406).entity("Das Produkt: "+ product.getName()+" existiert bereits").build();
        }

        List<Long>extraIds = IdExtractor.extractIds(product.getCompatibleExtras());
        List<Extras> dbExtras;

        try {
            dbExtras = em.createQuery("SELECT e FROM Extras e WHERE e.id IN :ids", Extras.class)
                            .setParameter("ids", extraIds)
                            .getResultList();
        } catch (Exception e) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity(e).build();
        }

        if (dbExtras.isEmpty()) {
            System.out.println("Keine Extras gefunden");
        }

        product.setCompatibleExtras(dbExtras);

        try {
            em.persist(product);
        }   catch (Exception e)
        {
            System.out.println(e);
            return Response.status(500).entity("Fehler beim einfügen des Produkts").build();
        }

      
        
        return Response.status(200).entity(String.format("Produkt: %s hinzugefügt", product.getName())).build();
    }

    @Transactional
    public Response updateProduct(Product product) {

        System.out.println("updateProduct");
        System.out.println(product.toString());
        
        Product dbProduct = new Product();

        try {
            dbProduct = em.find(Product.class, product.getId());
        } catch (Exception e) {
            System.out.println(e);
            return Response.status(500).entity("Error while updating product2").build();
        }

        if (dbProduct == null) {
            return Response.status(404).entity("Produkt nicht gefunden").build();
        }

        List<Long>extraIds = IdExtractor.extractIds(product.getCompatibleExtras());
        List<Extras> dbExtras;

        System.out.println(extraIds.toString());

        try {
            dbExtras = em.createQuery("SELECT e FROM Extras e WHERE e.id IN :ids", Extras.class)
                            .setParameter("ids", extraIds)
                            .getResultList();
        } catch (Exception e) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity(e).build();
        }
        
        if (dbExtras.isEmpty()) {
            
            if(product.getCompatibleExtras().isEmpty())
            {
                dbProduct.setCompatibleExtras(new ArrayList<Extras>());
                System.out.println("Keine Extras angegeben, lösche alle");
            }
            else
            {
                return Response.status(Response.Status.BAD_REQUEST).entity("Angegebene Extras nicht gefunden").build();
            }
        }

        dbProduct.setCompatibleExtras(dbExtras);

        // Update order sum if product price changed
        if(product.getPrice() != dbProduct.getPrice())
        {
            List<Order> orders = orderOrm.getOderByProducts(product.getId());

            Double newSum = 0.0;
            for (Order order : orders) {
                for (OrderItem oi : order.getOrderItems()) {
                    newSum += oi.getProduct().getPrice();
                }
                order.setSum(newSum);
                try {
                    em.merge(order);
                } catch (Exception e) {
                    return Response.status(500).entity("Error while updating order").build();
                }
            }
        }
        
        // Set only the updated fields
        Field[] declaredFields = Product.class.getDeclaredFields();
        for (Field field : declaredFields) {
            field.setAccessible(true); // If required for private fields

            try {
                Object fieldValue = field.get(product);
                if (fieldValue != null) {
                    field.set(dbProduct, fieldValue);
                }
            } catch (IllegalAccessException e) {
                return Response.status(500).entity("Error accessing field: " + field.getName()).build();
            }
        }

        try {
            em.merge(dbProduct);
        } catch (Exception e) {
            System.out.println(e);
            return Response.status(500).entity("Error while updating product [Merging]").build();
        }

        return Response.status(200).entity("Produkt "+ dbProduct.getName() + " aktualisiert").build();

    }

    @Transactional
    public Response deleteProductById(Long id) {
        
        Product product;
       
        try {
            product = em.find(Product.class, id);
            if (product.getOrderItems().size() > 0) {
                return Response.status(406).entity("Product has orders").build();
            }
        } catch (Exception e) {
            return Response.status(500).entity("Error while deleting product").build();
        }

        try {
            em.remove(product);
        } catch (Exception e) {
           return Response.status(500).entity("Error while deleting product").build();
        }
        return Response.status(200).entity(String.format("Produkt: %s gelöscht", product.getName())).build();
    }

}
