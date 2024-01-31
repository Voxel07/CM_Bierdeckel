package orm;

import java.util.ArrayList;
import java.util.List;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.core.Response;

import model.Request;
import model.Product;
import model.User;

@ApplicationScoped
public class RequestOrm {

    @Inject
    EntityManager em;

    public List<Request> getRequestById(Long id) {
        Request request = em.find(Request.class, id);
        List<Request> requests = new ArrayList<>();
        if (request != null) {
            requests.add(request);
        }
        return requests;
    }

    public List<Request> getAllRequests() {
        TypedQuery<Request> query = em.createQuery("SELECT r FROM Request r", Request.class);

        List<Request> requests = query.getResultList();
        System.out.println(requests.size());

        return requests;
    }


    @Transactional
    public Response createRequest(Long userId) {
        
        Request request = new Request();
        User user = new User();
        
        try {
            user = em.find(User.class, userId);
        } catch (Exception e) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity(e).build();
        }

        if (user == null) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity("User not found").build();
        }

        TypedQuery<Request> query = em.createQuery("SELECT r FROM Request r WHERE r.user =: user", Request.class);
        query.setParameter("user", user);

        if(query.getResultList().size() != 0)
        {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity("User already has an order").build();
        }
        
        request.setUser(user);
        
        try {
            em.persist(request);
        } catch (Exception e) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity(e).build();
        }
        
        user.setRequest(request);
        
        try {
            em.merge(user);
        } catch (Exception e) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity(e).build();
        }
        return Response.status(Response.Status.CREATED).entity("New Empty order created").build();
    }

    @Transactional
    public Response addProductToRequest(Long requestId, Long productId) {

        System.out.println("addProductToRequest");
       
        Request requestDB = new Request();
        Product productDB = new Product();
        try {
            requestDB = em.find(Request.class, requestId);
        } catch (Exception e) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity(e).build();
        }

        if (requestDB == null) {
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

        requestDB.addProduct(productDB);
        
        try {
            em.merge(requestDB);
        } catch (Exception e) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity(e).build();
        }
        return Response.status(Response.Status.CREATED).entity("New product added to order").build();
    }

    @Transactional
    public void removeProductFromOrder(Product product) {
        // em.merge(product);
    }

    @Transactional
    public void deleteOrder(Request order) {
        em.remove(order);
    }

}
