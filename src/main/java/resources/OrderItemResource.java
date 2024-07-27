package resources;
import java.util.List;

import jakarta.enterprise.context.RequestScoped;
import jakarta.ws.rs.Path;
import jakarta.inject.Inject;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.QueryParam;

import orm.OrderItemOrm;
import model.OrderItem;
import model.OrderItem.PaymentStatus;
import model.OrderItem.OrderStatus;
import model.OrderItem.OrderStatusActions;


@RequestScoped
@Path("/orderItem")
public class OrderItemResource {

    @Inject
    OrderItemOrm orderItemOrm;



    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response getOrderItems(  @QueryParam("orderStatus") String orderStatus ,
                                    @QueryParam("paymentStatus") String paymentStatus,
                                    @QueryParam("category") String category ) 
    {
        System.out.println(paymentStatus);
        System.out.println(orderStatus);
        System.out.println(category);

        PaymentStatus paymentStatusEnum = null;
        OrderStatus orderStatusEnum = null;
        
        if (paymentStatus != null) {
            try {
                paymentStatusEnum = PaymentStatus.valueOf(paymentStatus);
                return Response.status(200).entity(orderItemOrm.getOrderItemsByPaymentStatus(paymentStatusEnum)).build();

            } catch (IllegalArgumentException e) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("Invalid paymentStatus value")
                        .build();
            }
        }

        if (orderStatus != null) {
            try {
                orderStatusEnum = OrderStatus.valueOf(orderStatus);
                return Response.status(200).entity(orderItemOrm.getOrderItemsByOrderStatus(orderStatusEnum)).build();

            } catch (IllegalArgumentException e) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("Invalid orderStatus value")
                        .build();
            }
        }

        if(category != null){
            return Response.status(200).entity(orderItemOrm.getOrderItemsByProductCategory(category)).build();
        }

        else
        {
            return Response.status(Response.Status.OK).entity(orderItemOrm.getAllOrderitems()).build();
        }
    }

    @PUT
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateOrderItem(@QueryParam("state") String targetState,
                                    @QueryParam("action") String action,
                                    @QueryParam("extraId") Long extraId,
                                    List<OrderItem> orderItems)
    {
        OrderStatus target = null;
        OrderStatusActions itemAtion = null;

        if(orderItems == null)
        {
            return Response.status(Response.Status.BAD_REQUEST).entity("Fehlender Parameter").build();
        }
        if(extraId != null)
        {
            return handleExtra(extraId, orderItems.get(0).getId(), action);
        }
    
        if(targetState != null)
        {
            try
            {
                target = OrderStatus.valueOf(targetState.toUpperCase());
            } 
            catch (IllegalArgumentException e) 
            {
                System.out.println("could not parse otderTarget");
                target = null;
            }
        }

        if(action != null)
        {
            try
            {
                itemAtion = OrderStatusActions.valueOf(action.toUpperCase());
            } 
            catch (IllegalArgumentException e) 
            {
                System.out.println("could not parse otderTarget");
                itemAtion = null;
            }
        }
       
        return orderItemOrm.updateOrderItems(orderItems, itemAtion, target);
       
    }

    public Response handleExtra(Long extraId, Long orderItemId, String action)
    {
        if(action.equals("add"))
        {
            return orderItemOrm.addExtraToOrderItem(orderItemId, extraId);
        }
        else if(action.equals("remove") )
        {
            return orderItemOrm.removeExtraFromOrderItem(orderItemId, extraId);
        }
        else
        {
            return Response.status(Response.Status.BAD_REQUEST).entity("Invalid action").build();
        }
    }


  
}