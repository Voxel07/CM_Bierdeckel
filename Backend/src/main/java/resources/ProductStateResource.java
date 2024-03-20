package resources;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.Consumes;
import jakarta.inject.Inject;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.QueryParam;

import orm.ProductStateOrm;
import model.ProductState.PaymentStatus;
import model.ProductState;
import model.ProductState.OrderStatus;

@ApplicationScoped
@Path("/productState")
public class ProductStateResource {
    
    @Inject
    ProductStateOrm orm;

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response setProductStatus(ProductState productState) 
    {
        if (productState == null) {
            return Response.status(400).entity("Kein ProductState angegeben").build();
        }
        if (productState.getPaymentStatus() != null) {
            return orm.setPaymentStatus(productState);
        }
        else if(productState.getOrderStatus() != null){
            return orm.setOrderStatus(productState);
        }
        else
        {
            return Response.status(400).entity("Kein Status angegeben").build();
        }
    }
}
