package resources;

import jakarta.inject.Inject;

import java.util.List;

import io.quarkus.cache.CacheInvalidate;
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
    public List<Order> getOrder(@QueryParam("orderId") Long orderId,
                                @QueryParam("userId") Long userId) 
    {
        if(orderId != null)
        {
            return orm.getOrderById(orderId);
        }
        else if (userId != null)
        {
            return orm.getOderByUser(userId);
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
    @CacheInvalidate(cacheName = "product-stock-cache")
    public Response updateOrder(@QueryParam("orderId") Long orderId,
                                @QueryParam("productId") Long productId,
                                @QueryParam("extraId") Long extraId,
                                @QueryParam("orderItemId") Long orderItemId,
                                @QueryParam("action") String action
                                ) 
    {
        if (orderId == null  || action == null) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Missing parameter").build();
        }

        if(productId != null)
        {
            System.out.println("Product");
            return handleProduct(orderId, productId, action);
        }
        else if(extraId != null && orderItemId != null)
        {
            System.out.println("Extra");

            return handleExtra(orderId, extraId, orderItemId, action);
        }
        else if(orderItemId != null)
        {
            return handleOrderItem(orderId, orderItemId, action);
        }
        else
        {
            return Response.status(Response.Status.BAD_REQUEST).entity("Missing parameter").build();
        }

    }

    public Response handleExtra(Long orderId, Long extraId, Long orderItemId, String action)
    {
        if(action.equals("add"))
        {
            return orm.addExtraToOrder(orderId, orderItemId, extraId);
        }
        else if(action.equals("remove") )
        {
            return orm.removeExtraFromOrder(orderId,orderItemId, extraId);
        }
        else
        {
            return Response.status(Response.Status.BAD_REQUEST).entity("Invalid action").build();
        }
    }

    public Response handleProduct(Long orderId, Long productId, String action)
    {
        if(action.equals("add"))
        {
            return orm.addProductToOrder(orderId, productId);
        }
        else if(action.equals("remove") )
        {
            return orm.removeProductFromOrder(orderId, productId);
        }
       
        else
        {
            return Response.status(Response.Status.BAD_REQUEST).entity("Invalid action").build();
        }
    }

    public Response handleOrderItem(Long orderId, Long orderItemId, String action)
    {
        if (action.equals("payItem")) 
        {
            return orm.updateOrderPayment(orderId, orderItemId);
        }
        else if (action.equals("progress"))
        {
            return orm.updateOrderStatus(orderId, orderItemId);
        }
        else if (action.equals("payOrder") && orderItemId == 0)
        {
            return orm.payOrder(orderId);
        }
        else if (action.equals("completeOrder") && orderItemId == 0)
        {
            return orm.completeOrder(orderId);
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
