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
import model.Product;
import model.ProductState;
import model.User;
import model.ProductState.OrderStatus;
import model.ProductState.PaymentStatus;

@ApplicationScoped
public class OrderOrm {

    @Inject
    EntityManager em;

    @Inject
    ProductStateOrm productStateOrm;

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

       orderDB.addProduct(productDB);
        
        try {
            em.merge(orderDB);
        } catch (Exception e) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity(e).build();
        }

        ProductState productState = new ProductState(PaymentStatus.UNPAID, OrderStatus.ORDERED, productDB,orderDB);

        productStateOrm.createProductState(productState);
                     
        return Response.status(Response.Status.CREATED).entity("New product added to order").build();
    }

    @Transactional
    public void removeProductFromOrder(Product product) {
        // em.merge(product);
    }

    @Transactional
    public void deleteOrder(Order order) {
        em.remove(order);
    }

}
