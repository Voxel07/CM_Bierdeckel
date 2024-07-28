package resources;

import java.util.List;

import io.quarkus.cache.CacheInvalidate;
import io.quarkus.cache.CacheResult;
import model.Product;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.websocket.server.PathParam;
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
import model.Extras;

@ApplicationScoped
@Path("/products")
public class ProductResource {
    
    private int counter = 0;
    @Inject 
    ProductOrm orm;
    
    @GET
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public List<Product> getProducts(@QueryParam("productId") Long productId, 
                                     @QueryParam("category") String category)
    {
        if (productId != null) {
            return orm.getProductById(productId);
        }
        else if(category != null)
        {
            return orm.getProductByCategory(category);
        }
        else
        {
            return orm.getAllProducts();
        }
    }

    @Path("/{productId}")
    @GET
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @CacheResult(cacheName = "product-stock-cache") 
    public Long getStockInfo(@PathParam("productId") Long productId){
        counter +=1;
        System.err.println("-----------------"+counter+"----------------------");
        return orm.getProductStock(productId);
    }

    @Path("/stock")
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateStock(@QueryParam("productId") Long productId,
                                @QueryParam("action") String action){
        return orm.updateProductStock(productId, action);
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
    @CacheInvalidate(cacheName = "product-stock-cache")
    public Response updateProduct(Product product) {
        return orm.updateProduct(product);
    }
    
    
    @DELETE
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @CacheInvalidate(cacheName = "product-stock-cache")
    public Response deleteProduct(Product product) {

        if(product.getId() != null)
        {
            return orm.deleteProductById(product.getId());
        }
        else{
            return Response.status(Response.Status.BAD_REQUEST).entity("Missing or empty productId").build();
        }
    }
}
