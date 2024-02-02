package resources;

import jakarta.inject.Inject;

import java.util.List;

import jakarta.enterprise.context.RequestScoped;
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

@RequestScoped
@Path("/order")
public class OrderResource {

    @Inject
    OrderOrm orm;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public List<Order> getAllOrder(@QueryParam("orderId") Long orderId) 
    {
        if(orderId != null)
        {
            return orm.getOrderById(orderId);
        }
        else
        {
            return orm.getAllOrder();
        }
    }

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createOrder(@QueryParam("userId") Long userId) {
        if (userId == null) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Missing or empty userId").build();
        }
        
        return orm.createOrder(userId);
    }

    @PUT
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateOrder(@QueryParam("orderId") Long orderId,
                                        @QueryParam("productId") Long productId) 
    {
        if (orderId == null || productId == null) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Missing or empty orderId or productId").build();
        }
        return orm.addProductToOrder(orderId, productId);
    }

    @DELETE
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response deleteOrder(@QueryParam("orderId") int orderId) {
        // Implementation for deleting an order
        return Response.noContent().build();
    }
}
