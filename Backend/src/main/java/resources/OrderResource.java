package resources;

import com.oracle.svm.core.annotate.Inject;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.*;
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
    public Response getAllOrders() {
        // Implementation for getting all orders
        return Response.ok().build();
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response getOrderById(@PathParam("orderId") int orderId) {
        // Implementation for getting an order by id
        return Response.ok().build();
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createOrder(Order order) {
        // Implementation for creating an order
        return Response.status(Response.Status.CREATED).build();
    }

    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateOrder(Order order) {
        // Implementation for updating an order
        return Response.ok().build();
    }

    @DELETE
    public Response deleteOrder(@PathParam("orderId") int orderId) {
        // Implementation for deleting an order
        return Response.noContent().build();
    }
}
