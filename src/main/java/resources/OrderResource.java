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
import model.OrderItem;
import model.Product;
import orm.OrderOrm;

@RequestScoped
@Path("/order")
public class OrderResource {

    @Inject
    OrderOrm orm;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response getOrder(@QueryParam("orderId") Long orderId,
                             @QueryParam("userId") Long userId,
                             @QueryParam("completed") Boolean compledetOrder,
                             @QueryParam("paymentState") String paymentState)
    {
        if(orderId != null)
        {
            return orm.getOrderById(orderId);
        }
        else if (userId != null && compledetOrder != null)
        {
            return orm.getOderByUser(userId, compledetOrder);
        }
        else if (paymentState != null)
        {
            System.out.println(paymentState);

            if(paymentState.equals("paid"))
            {
                System.out.println("paid");
                return  Response.status(200).entity(orm.getOrdersByPaymentState(true)).build();
            }
            else{
                System.out.println("nope");

                return  Response.status(200).entity(orm.getOrdersByPaymentState(false)).build();
            }

        }
        else
        {
            return orm.getAllOrder();
        }
    }

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createOrder(@QueryParam("userId") Long userId, List<OrderItem> OrderItems) {
        if (userId == null) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Missing or empty userId").build();
        }
        System.out.println(OrderItems.toString());

        // return Response.status(200).entity(OrderItems).build();
        return orm.createOrder(userId, OrderItems);
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
                                @QueryParam("action") String action,
                                @QueryParam("userId") Long userId, 
                                List<OrderItem> OrderItems
                                )
    {
        if(userId != null && OrderItems != null)
        {
            return orm.updateOrder(userId, OrderItems);
        }
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
        else if (action.equals("payOrder"))
        {
            System.out.println("paythatnow");
            return orm.payOrder(orderId);
        }
        else if (action.equals("completeOrder"))
        {
            return orm.completeOrder(orderId);
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
        // else if (action.equals("progress"))
        // {
        //     return orm.updateOrderStatus(orderId, orderItemId);
        // }
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
