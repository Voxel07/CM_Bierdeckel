package resources;
import java.util.ArrayList;
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
import model.OrderItem;
import jakarta.ws.rs.QueryParam;

import orm.OrderItemOrm;
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
    public Response updateOrderItem(@QueryParam("orderItemId") Long orderItemId,
                                    @QueryParam("action") String action)
    {
        if(orderItemId == null || action == null)
        {
            return Response.status(Response.Status.BAD_REQUEST).entity("Fehlender Parameter").build();
        }

        try
        {
            OrderStatusActions orderAction = OrderStatusActions.valueOf(action.toUpperCase());
            return orderItemOrm.updateOrderItemState(orderItemId, orderAction);
        } 
        catch (IllegalArgumentException e) 
        {
            return Response.status(Response.Status.BAD_REQUEST).entity("Ungültiger Parameter").build();
        }
    }


  
}