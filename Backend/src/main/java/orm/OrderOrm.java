package orm;

import java.util.List;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.Response;

import model.Order;
import model.Product;
import model.User;

@ApplicationScoped
public class OrderOrm {

    @Inject
    EntityManager em;

    
    public List<Order> getAllOrders() {
        TypedQuery<Order> query = em.createQuery("SELECT o FROM Request o", Order.class);
        return query.getResultList();
    }

    public Order getOrderById(Long id) {
        return em.find(Order.class, id);
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

        user.setOrder(order);

        
        
        try {
            em.persist(order);
            
        } catch (Exception e) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity(e).build();
            
        }
        
        try {
            em.merge(user);
        } catch (Exception e) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity(e).build();
        }
        return Response.status(Response.Status.CREATED).entity("New Empty order created").build();
    }

    @Transactional
    public void addProductToOrder(@QueryParam("orderId") Long orderId, Product product) {
        // em.merge(product);
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
