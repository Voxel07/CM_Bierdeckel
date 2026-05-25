package resources;

import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;

import java.util.ArrayList;
import java.util.List;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;

import orm.UserOrm;
import model.User;

@ApplicationScoped
@Path("/users")
public class UserResource {
    
    @Inject
    UserOrm orm;

    @Inject
    test.SocketTest socketTest;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public List<User> getUser(@QueryParam("userId") Long userId, @QueryParam("username") String userName)
    {
        List<User> users = new ArrayList<>();
        if (userId != null)
        {
            System.out.println("userId");
            users.add(orm.getUserById(userId)) ;
            return users;
        }
        else if (userName != null)
        {
            System.out.println("userName");
            users.add(orm.getUserByUsername(userName));
            return users;
        }
        else
        {
            System.out.println("all");
            return orm.getAllUsers();
        }
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response addUser(User user) {
        Response response = orm.addUser(user);
        if (response != null && response.getStatusInfo().getFamily() == Response.Status.Family.SUCCESSFUL) {
            socketTest.broadcast("users");
        }
        return response;
    }

    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateUser(User user) {
        Response response = orm.updateUser(user);
        if (response != null && response.getStatusInfo().getFamily() == Response.Status.Family.SUCCESSFUL) {
            socketTest.broadcast("users");
        }
        return response;
    }

    @DELETE
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteUser(User user) {
        Response response = orm.delteUser(user);
        if (response != null && response.getStatusInfo().getFamily() == Response.Status.Family.SUCCESSFUL) {
            socketTest.broadcast("users");
        }
        return response;
    }
}
