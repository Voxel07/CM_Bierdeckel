package resources;

import jakarta.inject.Inject;

import java.util.List;

import jakarta.enterprise.context.ApplicationScoped;
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

import model.Request;
import orm.RequestOrm;

@RequestScoped
@Path("/requests")
public class RqeuestResource {

    @Inject
    RequestOrm orm;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public List<Request> getAllOrders(@QueryParam("orderId") Long orderId) 
    {
        if(orderId != null)
        {
            return orm.getRequestById(orderId);
        }
        else
        {
            return orm.getAllRequests();
        }
    }

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createRequest(@QueryParam("userId") Long userId) {
        if (userId == null) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Missing or empty userId").build();
        }
        
        return orm.createRequest(userId);
    }

    @PUT
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateRequest(@QueryParam("requestId") Long requestId,
                                        @QueryParam("productId") Long productId) 
    {
        if (requestId == null || productId == null) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Missing or empty requestId or productId").build();
        }
        return orm.addProductToRequest(requestId, productId);
    }

    @DELETE
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response deleteRequest(@QueryParam("requestId") int requestId) {
        // Implementation for deleting an order
        return Response.noContent().build();
    }
}
