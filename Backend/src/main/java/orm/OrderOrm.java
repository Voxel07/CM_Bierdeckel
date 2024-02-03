package orm;

import java.util.ArrayList;
import java.util.List;

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

@ApplicationScoped
public class OrderOrm {

    @Inject
    EntityManager em;

    public List<Order> getOrderById(Long id) {
        Order order = em.find(Order.class, id);
        List<Order> orders = new ArrayList<>();
        if (order != null) {
            orders.add(order);
        }
        return orders;
    }

    public List<Order> getAllOrder() {
        TypedQuery<Order> query = em.createQuery("SELECT r FROM Order r", Order.class);

        List<Order> order = query.getResultList();
        System.out.println(order.size());

        return order;
    }

    public List<Order> getOderByProducts(Long productId) {
        TypedQuery<Order> query = em.createQuery("SELECT r FROM Order r JOIN r.orderItems o WHERE o.product.id = :productId", Order.class);
        query.setParameter("productId", productId);

        List<Order> order = query.getResultList();

        return order;
    }


    @Transactional
    public Response createOrder(Long userId) {
        
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

        if(query.getResultList().size() != 0)
        {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity("User already has an order").build();
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
        return Response.status(Response.Status.CREATED).entity("New Empty order created").build();
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

        System.out.println("orderItems.size " + orderItems.size());

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
    public Response deleteOrder(Order order) {
        
        try {
            em.remove(order);
            
        } catch (Exception e) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity(e).build();
        }
        return Response.status(Response.Status.OK).entity("Order deleted").build();
    }

}
