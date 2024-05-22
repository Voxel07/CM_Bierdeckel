package orm;

import jakarta.inject.Inject;
import jakarta.persistence.EntityExistsException;
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
        
        User dbUser;

        try {
            dbUser =  em.createQuery("SELECT u FROM User u WHERE u.username = :username", User.class)
            .setParameter("username", username).getSingleResult();
        } catch (Exception e) {
            dbUser = null;
        }
        return dbUser;
    }

    @Transactional
    public Response addUser(User user) {

        User dbUser = getUserByUsername(user.getUsername());
        if (dbUser != null) {
            return Response.status(Response.Status.FORBIDDEN).entity("Benutzer mit diesem namen gibt es bereits").build();
        }
        else{
            try {
                em.persist(user);
            } catch (Exception e) {
                    return Response.status(Response.Status.EXPECTATION_FAILED).entity("duck").build();
            }
        }
        return Response.status(Response.Status.CREATED).entity("New user created").build();
    }

}
