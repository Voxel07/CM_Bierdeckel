package orm;

import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.core.Response;

import java.util.List;

import jakarta.enterprise.context.ApplicationScoped;

import model.User;

@ApplicationScoped
public class UserOrm {
    @Inject
    EntityManager em;


    public List<User> getAllUsers() {
        return em.createQuery("SELECT u FROM User u", User.class).getResultList();
    }

    public User getUserById(Long id) {
        return em.find(User.class, id);
    }

    public User getUserByUsername(String username) {
        return em.createQuery("SELECT u FROM User u WHERE u.username = :username", User.class)
                .setParameter("username", username).getSingleResult();
    }

    @Transactional
    public Response addUser(User user) {
        
        try {
            em.persist(user);
            
        } catch (Exception e) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity(e).build();
        }
        return Response.status(Response.Status.CREATED).entity("New user created").build();
    }

}
