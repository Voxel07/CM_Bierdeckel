package resources;

import jakarta.inject.Inject;

import java.util.List;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import model.Order;
import orm.OrderOrm;

@ApplicationScoped
@Path("/orders")
public class OrderResource {

    @Inject
    OrderOrm orm;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Order> getAllOrders() {
        // Implementation for getting all orders
        return orm.getAllOrders();
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response getOrderById(@QueryParam("orderId") int orderId) {
        // Implementation for getting an order by id
        return Response.ok().build();
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createOrder(@QueryParam("userId") Long userId) {
        if (userId == null) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Missing or empty userId").build();
        }
        
        return orm.createOrder(userId);
    }

    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateOrder(Order order) {
        // Implementation for updating an order
        return Response.ok().build();
    }

    @DELETE
    public Response deleteOrder(@QueryParam("orderId") int orderId) {
        // Implementation for deleting an order
        return Response.noContent().build();
    }
}
