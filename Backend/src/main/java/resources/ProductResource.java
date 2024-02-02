package resources;

import java.util.List;
import model.Product;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import orm.ProductOrm;

@ApplicationScoped
@Path("/products")
public class ProductResource {
    
    @Inject 
    ProductOrm orm;
    
    @GET
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public List<Product> getAllProducts(@QueryParam("productId") Long productId, 
                                        @QueryParam("orderId") Long orderId) 
    {
        if (productId != null) {
            return orm.getProductById(productId);
        }
        else
        {
            return orm.getAllProducts();
        }
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createProduct(Product product) {
        return orm.createProduct(product);

    }
    
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateProduct(Product product) {
        return orm.updateProduct(product);
    }
    
    
    @DELETE
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String deleteProduct(Long Id) {
        orm.deleteProductById(Id);
        return "Product deleted";
    }
}
