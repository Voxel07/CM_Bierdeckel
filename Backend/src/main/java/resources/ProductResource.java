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
import jakarta.ws.rs.core.MediaType;

import orm.ProductOrm;

@ApplicationScoped
@Path("/products")
public class ProductResource {
    
    @Inject 
    ProductOrm orm;
    
    @GET
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public List<Product> getAllProducts() {
        System.err.println("getAllProducts");
        return orm.getAllProducts();
    }
    
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public void updateProduct(Product product) {
        orm.updateProduct(product);
    }
    
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String createProduct(Product product) {
        orm.createProduct(product);
        return "Product created";
    }
    
    @DELETE
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String deleteProduct(Long Id) {
        orm.deleteProductById(Id);
        return "Product deleted";
    }
}
