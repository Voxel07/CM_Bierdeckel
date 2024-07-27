package orm;

import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceException;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.core.Response;

import java.util.List;

import org.hibernate.exception.ConstraintViolationException;

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
            return Response.status(Response.Status.FORBIDDEN).entity("Benutzer mit diesem Namen gibt es bereits").build();
        }

        //Ingore any given id. The id will be set by the db
        if(user.getId() != null)
        {
            user.setId(null);
        }

        try {
            em.persist(user);
            em.flush(); // This will force the INSERT to be executed immediately
        } catch (PersistenceException e) {
            Throwable cause = e.getCause();
            if (cause instanceof ConstraintViolationException) {
                // This catches the specific ConstraintViolationException
                return Response.status(Response.Status.CONFLICT)
                    .entity("Ein Benutzer mit dieser ID existiert bereits.")
                    .build();
            } else {
                // Handle other persistence exceptions
                return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Ein unerwarteter Fehler ist aufgetreten.")
                    .build();
            }
        } catch (Exception e) {
            // Catch any other unexpected exceptions
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                .entity("Ein unerwarteter Fehler ist aufgetreten.")
                .build();
        }

        return Response.status(Response.Status.CREATED).entity("Nutzer erfolgreich erstellt").build();
    }

    @Transactional
    public Response updateUser(User user)
    {
        boolean error = false;
        String errorMSG = "";

        TypedQuery<User> query = em.createQuery("SELECT u FROM User u WHERE u.username =: username OR u.id =: Id", User.class); //All values are needed to detect dublicate

        query.setParameter("username", user.getUsername());
        query.setParameter("Id", user.getId());

        List<User> userAusDB = query.getResultList();
       

        // Wenn user zurückgekomen sind
        if (userAusDB == null) return Response.notModified( "Keinen Nutzer mit diesen Daten gefunden").build();
        // Check all user to return a the specific reason.
        // NOTE: short to  userAusDB.size() != 1 ?
        for (User aktUser : userAusDB)
        {
            // Überprüfen ob die ID die gleiche ist.
            if (!aktUser.getId().equals(user.getId()) && !error)
            {
                if (aktUser.getUsername().equals(user.getUsername()))
                {
                    error = true;
                    errorMSG = "Username bereits vergeben";
                }
            }
        }

        if (error) return Response.notModified().entity(errorMSG).build(); //Return the specific reason.

        try
        {
            em.merge(user);
            errorMSG = "User erfolgreich aktualisiert";
        }
        catch (Exception e)
        {
            errorMSG = "Fehler beim Updaten des User";
        }


        return Response.ok().entity(errorMSG).build();
    }

    @Transactional
    public Response delteUser(User user)
    {
        User dbUser;

        try{
            dbUser = em.find(User.class, user.getId());
        }
        catch(Exception e)
        {
            return Response.status(Response.Status.BAD_REQUEST).entity("Nutzer nicht gefunden").build();
        }

        try {
            em.remove(dbUser);
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Fehler beim löschen des Benutzers").build();
        }

        return Response.status(Response.Status.OK).entity("Benutzer erfolgreich gelöscht").build();
    }

}
