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

    
    /**
     * Updates the order based on the provided parameters.
     * 
     * @param orderId   the ID of the order
     * @param productId the ID of the product for remove, payment or progress its the orderItem id
     * @param action    the action to perform on the order
     * @return          the response indicating the success or failure of the update
     */
    @PUT
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateOrder(@QueryParam("orderId") Long orderId,
                                @QueryParam("productId") Long productId,
                                @QueryParam("action") String action) 
    {
        if (orderId == null || productId == null || action == null) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Missing parameter").build();
        }

        if(action.equals("add"))
        {
            return orm.addProductToOrder(orderId, productId);
        }
        else if(action.equals("remove") )
        {
            return orm.removeProductFromOrder(orderId, productId);
        }
        else if (action.equals("payItem")) 
        {
            return orm.updateOrderPayment(orderId, productId);
        }
        else if (action.equals("progress"))
        {
            return orm.updateOrderStatus(orderId, productId);
        }
        else if (action.equals("payOrder") && productId == 0)
        {
            return orm.payOrder(orderId);
        }
        else
        {
            return Response.status(Response.Status.BAD_REQUEST).entity("Invalid action").build();
        }
    }

    @DELETE
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response deleteOrder(Order order) 
    {
        if (order == null) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Missing or empty order").build();
            
        }

        return orm.deleteOrder(order);
    }
}
