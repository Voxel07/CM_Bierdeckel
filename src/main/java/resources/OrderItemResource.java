package resources;
import java.util.ArrayList;
import java.util.List;

import jakarta.enterprise.context.RequestScoped;
import jakarta.ws.rs.Path;
import jakarta.inject.Inject;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import model.OrderItem;
import jakarta.ws.rs.QueryParam;

import orm.OrderItemOrm;
import model.OrderItem.PaymentStatus;
import model.OrderItem.OrderStatus;


@RequestScoped
@Path("/orderItem")
public class OrderItemResource {

    @Inject
    OrderItemOrm orderItemOrm;



    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response getOrderItems(@QueryParam("orderStatus") String orderStatus ,
                                         @QueryParam("paymentStatus") String paymentStatus) 
    {
        System.out.println(paymentStatus);
        System.out.println(orderStatus);

        PaymentStatus paymentStatusEnum = null;
        OrderStatus orderStatusEnum = null;
        
        if (paymentStatus != null) {
            try {
                paymentStatusEnum = PaymentStatus.valueOf(paymentStatus);
            } catch (IllegalArgumentException e) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("Invalid paymentStatus value")
                        .build();
            }
        }
        if (orderStatus != null) {
            try {
                orderStatusEnum = OrderStatus.valueOf(orderStatus);
            } catch (IllegalArgumentException e) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("Invalid orderStatus value")
                        .build();
            }
        }

        if (paymentStatus != null) {
            return Response.status(200).entity(orderItemOrm.getOrderItemsByPaymentStatus(paymentStatusEnum)).build();
        } 
        else if(orderStatus != null) {
            return Response.status(200).entity(orderItemOrm.getOrderItemsByOrderStatus(orderStatusEnum)).build();
        }
        else
        {
            return Response.status(Response.Status.BAD_REQUEST).entity(orderItemOrm.getAllOrderitems()).build();
        }
    }
  
}