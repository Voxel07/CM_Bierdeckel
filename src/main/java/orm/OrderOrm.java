package orm;

import java.util.ArrayList;
import java.util.List;
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
import model.User;
import model.OrderItem.PaymentStatus;
import model.ExtraItem;
import model.Extras;
import model.OrderItem;

@ApplicationScoped
public class OrderOrm {

    @Inject
    EntityManager em;

    public Response getOrderById(Long id) {
        Order order = em.find(Order.class, id);
        List<Order> orders = new ArrayList<>();
        if (order != null) {
            orders.add(order);
        }
        return Response.status(Response.Status.OK).entity(orders).build();
    }

    public Response getAllOrder() {
        TypedQuery<Order> query = em.createQuery("SELECT r FROM Order r", Order.class);

        try {
            return Response.status(Response.Status.OK).entity(query.getResultList()).build();

        } catch (Exception e) {
            return  Response.status(Response.Status.OK).entity(new ArrayList<>()).build();
        }
    }

    public Response getOderByUser(Long asd)
    {
        TypedQuery<Order> query = em.createQuery("SELECT o FROM Order o WHERE o.user.id = :val", Order.class);
        query.setParameter("val", asd);
        try {
            return Response.status(Response.Status.OK).entity(query.getResultList()).build();

        } catch (Exception e) {
            return  Response.status(Response.Status.OK).entity(new ArrayList<>()).build();
        }
    }

    public List<Order> getOderByProducts(Long productId) {
        TypedQuery<Order> query = em.createQuery("SELECT r FROM Order r JOIN r.orderItems o WHERE o.product.id = :productId", Order.class);
        query.setParameter("productId", productId);

        return query.getResultList();
    }

    public List<Order> getOderByExtras(Long extraId) {
        TypedQuery<Order> query = em.createQuery("SELECT o FROM Order o JOIN o.orderItems oi JOIN oi.extraItems ei WHERE ei.extras.id = :extraId", Order.class);
        query.setParameter("extraId", extraId);

        return  query.getResultList();
    }


    @Transactional
    public Response createOrder(Long userId, List<OrderItem> OrderItems) {

        Order order = new Order();
        User user = new User();

        try {
            user = em.find(User.class, userId);
        } catch (Exception e) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity(e).build();
        }

        if (user == null) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity("User not found").build();
        }

        TypedQuery<Order> query = em.createQuery("SELECT r FROM Order r WHERE r.user =: user", Order.class);
        query.setParameter("user", user);


        if(!query.getResultList().isEmpty())
        {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity("Der Benutzer hat schon eine Bestellung. Aktualisiere diese Bestellung").build();
        }
        order.setUser(user);

        try {
            em.persist(order);
        } catch (Exception e) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity(e).build();
        }

        user.setOrder(order);

        try {
            em.merge(user);
        } catch (Exception e) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity(e).build();
        }

        //Create a map to store the product and its count
        Map<Product, Long> productCountMap = new HashMap<>();

        Long cntOderItems = 0L;

        //Iterate over the order items
        for (OrderItem orderItem : OrderItems) {
            cntOderItems++;
            addProductToOrder(order.getId(), orderItem.getProduct().getId());
            //Get the product from the order item
            Product product = orderItem.getProduct();

            //Check if the product is already in the map
            if(productCountMap.containsKey(product)){
                //If so, increase the count by one
                productCountMap.put(product, productCountMap.get(product) + 1);
            } else {
                //If not, add the product to the map with count 1
                productCountMap.put(product, 1L);
            }
        }
        em.getTransaction().begin();
        //Iterate over the map
        for (Map.Entry<Product, Long> entry : productCountMap.entrySet()) {
            //Get the product and the count
            Product product = entry.getKey();
            Long count = entry.getValue();
            System.out.println(product.getId());


            Product dbProduct = em.find(Product.class, product.getId());

            if (dbProduct == null) {
                em.getTransaction().rollback();
                return Response.status(Response.Status.CONFLICT).entity("ID passt nicht").build();
            }

            //Decrease the stock of the product
            dbProduct.decStock(count);

            //Merge the dbProduct to the db
            em.merge(dbProduct);
        }
        em.getTransaction().commit();

        return Response.status(Response.Status.CREATED).entity("Neue Bestellung mit " + cntOderItems + " Produkten").build();
    }

    @Transactional
    public Response updateOrder(Long userId, List<OrderItem> OrderItems) {
        return Response.ok().build();
    }

    @Transactional
    public Response addProductToOrder(Long orderId, Long productId) {

        System.out.println("addProductToOrder");

        Order orderDB = new Order();
        Product productDB = new Product();
        try {
            orderDB = em.find(Order.class, orderId);
        } catch (Exception e) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity(e).build();
        }

        if (orderDB == null) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity("Order not found").build();
        }

        try {
            productDB = em.find(Product.class, productId);
        } catch (Exception e) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity(e).build();
        }

        if (productDB == null) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity("Product not found").build();
        }

        OrderItem orderItem = new OrderItem(productDB, orderDB, OrderItem.PaymentStatus.UNPAID, OrderItem.OrderStatus.ORDERED);
        orderDB.addOrderItem(orderItem);

        try {
            System.out.println("merge");

            em.merge(orderDB);
        } catch (Exception e) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity(e).build();
        }

        return Response.status(Response.Status.CREATED).entity("Product added to order").build();
    }

    @Transactional
    public Response removeProductFromOrder(Long orderId, Long orderItemId)
    {
        System.out.println("addProductToOrder");

        Order orderDB = new Order();
        try {
            orderDB = em.find(Order.class, orderId);
        } catch (Exception e) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity(e).build();
        }

        if (orderDB == null) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity("Order not found").build();
        }

        List<OrderItem> orderItems = orderDB.getOrderItems();
        boolean itemFound = false;

        // only remove the first item found
        for (OrderItem orderItem : orderItems) {
            if (orderItem.getId() == orderItemId) {
                // em.remove(orderItem); // Remove the OrderItem from the database
                orderDB.removeOrderItem(orderItem);
                itemFound = true;
                break;
            }
        }

        System.out.println("orderDB.getOrderItems " + orderDB.getOrderItems().size());

        if (!itemFound) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity("Item not found").build();
        }

        try {
            em.merge(orderDB);
        } catch (Exception e) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity(e).build();
        }

        return Response.status(Response.Status.CREATED).entity("Product removed from order").build();
    }

    @Transactional
    public Response addExtraToOrder(Long orderId, Long orderItemId, Long extraId) {

        System.out.println("addExtraToOrder2");

        Order orderDB = new Order();
        OrderItem orderItemDb = new OrderItem();
        Extras extraDB = new Extras();

        try {
            orderDB = em.find(Order.class, orderId);
        } catch (Exception e) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity(e).build();
        }

        if (orderDB == null) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity("Order not found").build();
        }

        try {
            orderItemDb = em.find(OrderItem.class, orderItemId);
        } catch (Exception e) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity(e).build();
        }

        if (orderItemDb == null) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity("OrderItem not found").build();
        }

        try {
            extraDB = em.find(Extras.class, extraId);
        } catch (Exception e) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity(e).build();
        }

        if (extraDB == null) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity("Extra not found").build();
        }

        ExtraItem extra = new ExtraItem(orderItemDb, extraDB);
        orderItemDb.addExtraItem(extra);

        try {
            System.out.println("merge");

            em.merge(orderItemDb);
        } catch (Exception e) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity(e).build();
        }

        return Response.status(Response.Status.CREATED).entity("Extra added to order").build();
    }

    @Transactional
    public Response removeExtraFromOrder(Long orderId, Long orderItemId, Long extraId)
    {
        System.out.println("addProductToOrder");

        Order orderDB = new Order();
        try {
            orderDB = em.find(Order.class, orderId);
        } catch (Exception e) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity(e).build();
        }

        if (orderDB == null) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity("Order not found").build();
        }

        OrderItem orderItem = orderDB.getOrderItemById(orderItemId);

        Boolean itemFound = false;
        // only remove the first item found
        for (ExtraItem ei : orderItem.getExtraItems()) {
            if (ei.getExtras().getId() == extraId) {
                // em.remove(orderItem); // Remove the OrderItem from the database
                orderItem.removeExtraItem(ei);
                itemFound = true;
                break;
            }
        }

        if (!itemFound) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity("Extra not found").build();
        }

        try {
            em.merge(orderItem);
        } catch (Exception e) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity(e).build();
        }

        return Response.status(Response.Status.CREATED).entity("Extra removed from order").build();
    }

    @Transactional
    public Response updateOrderStatus(Long orderId, Long orderItemId) {
        Order orderDB = new Order();
        try {
            orderDB = em.find(Order.class, orderId);
        } catch (Exception e) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity(e).build();
        }

        if (orderDB == null) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity("Order not found").build();
        }

        OrderItem orderItem = new OrderItem();
        try {
            orderItem = em.find(OrderItem.class, orderItemId);
        } catch (Exception e) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity(e).build();
        }

        if (orderItem == null) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity("Order item not found").build();

        }

        switch (orderItem.getOrderStatus()) {
            case ORDERED:
                orderDB.setOrderItemState(orderItem, OrderItem.OrderStatus.IN_PROGRESS);
                break;
            case IN_PROGRESS:
                orderDB.setOrderItemState(orderItem, OrderItem.OrderStatus.DELIVERED);
                break;
            case DELIVERED:
                return Response.status(Response.Status.EXPECTATION_FAILED).entity("Order item state limit reached").build();
            default:
                return Response.status(Response.Status.EXPECTATION_FAILED).entity("Invalid action").build();
        }

        try {
            em.merge(orderDB);
        } catch (Exception e) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity(e).build();
        }

        return Response.status(Response.Status.CREATED).entity("Order updated").build();
    }

    @Transactional
    public Response updateOrderPayment(Long orderId, Long orderItemId) {

        Order orderDB = new Order();
        try {
            orderDB = em.find(Order.class, orderId);
        } catch (Exception e) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity(e).build();
        }

        if (orderDB == null) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity("Order not found").build();
        }

        OrderItem orderItem = new OrderItem();
        try {
            orderItem = em.find(OrderItem.class, orderItemId);
        } catch (Exception e) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity(e).build();
        }

        if (orderItem == null) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity("Order item not found").build();
        }

        if (orderItem.getPaymentStatus() == PaymentStatus.PAID) {
            orderDB.setOrderItemPay(orderItem, PaymentStatus.UNPAID);
        } else {
            orderDB.setOrderItemPay(orderItem, PaymentStatus.PAID);
        }

        try {
            em.merge(orderItem);
        } catch (Exception e) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity(e).build();
        }

        return Response.status(Response.Status.CREATED).entity("Order updated").build();
    }

    @Transactional
    public Response payOrder(Long orderId) {
        Order orderDB = new Order();
        try {
            orderDB = em.find(Order.class, orderId);
        } catch (Exception e) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity(e).build();
        }

        if (orderDB == null) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity("Order not found").build();
        }

        orderDB.payOrder();

        try {
            em.merge(orderDB);
        } catch (Exception e) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity(e).build();
        }

        return Response.status(Response.Status.CREATED).entity("Order paid").build();
    }

    @Transactional
    public Response completeOrder(Long orderId) {
        Order orderDB = new Order();
        try {
            orderDB = em.find(Order.class, orderId);
        } catch (Exception e) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity(e).build();
        }

        if (orderDB == null) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity("Order not found").build();
        }

        orderDB.completeOrder();

        try {
            em.merge(orderDB);
        } catch (Exception e) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity(e).build();
        }

        return Response.status(Response.Status.CREATED).entity("Order completed").build();
    }

    @Transactional
    public Response deleteOrder(Order order) {

        Order orderDB = new Order();
        try {
            orderDB = em.find(Order.class, order.getId());
        }
        catch (Exception e) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity("Bestellung nicht gefunden").build();
        }

        if (orderDB == null) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity("Bestellung nicht gefunden").build();
        }

        try {
            em.remove(orderDB);

        } catch (Exception e) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity(e).build();
        }
        return Response.status(Response.Status.OK).entity("Bestellung gelöscht").build();
    }

}
