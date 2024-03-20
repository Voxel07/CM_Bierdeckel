package orm;

import java.util.ArrayList;
import java.util.List;

import model.Order;
import model.OrderItem;
import model.Product;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.core.Response;

@ApplicationScoped
public class ProductOrm {
    
    @Inject
    EntityManager em;

    @Inject
    OrderOrm orderOrm;

    public List<Product> getProductById(Long id) {
        Product product = em.find(Product.class, id);
        List<Product> products = new ArrayList<>();
        if (product != null) {
            products.add(product);
        }
        return products;
    }

    public List<Product> getAllProducts() {
        TypedQuery<Product> query = em.createQuery("SELECT p FROM Product p", Product.class);
        return query.getResultList();
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

        try {
            em.persist(product);
        }   catch (Exception e)
        {
            return Response.status(500).entity("Fehler beim einfügen des Produkts").build();
        }
        
        return Response.status(200).entity(String.format("Produkt: %s hinzugefügt", product.getName())).build();
    }

    @Transactional
    public Response updateProduct(Product product) {
        
        try {
            em.merge(product);
        } catch (Exception e) {
            return Response.status(500).entity("Error while updating product").build();
        }

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

        return Response.status(200).entity("Product updated").build();

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
