package resources;
import java.util.List;

import io.quarkus.cache.CacheInvalidate;
import io.quarkus.cache.CacheResult;
import orm.ExtrasOrm;
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
import model.Extras;


@ApplicationScoped
@Path("/extras")
public class ExtrasResource {

    @Inject
    ExtrasOrm orm;

    @GET
    // @CacheResult(cacheName = "fetch-extras") 
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public List<Extras> getAllExtras(   @QueryParam("extrasId") Long extrasId,
                                        @QueryParam("category") String category) {
        if (extrasId != null) {
            return orm.getExtrasById(extrasId);
        }
        else if(category != null)
        {
            return orm.getExtraByCategory(category);
        }
        else {
            return orm.getAllExtras();
        }
    }

    @POST
    // @CacheInvalidate(cacheName = "fetch-extras") 
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createExtras(Extras extra) {
        return orm.createExtras(extra);
    }

    @PUT
    // @CacheInvalidate(cacheName = "fetch-extras") 
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateExtras(Extras extra) {
        return orm.updateExtras(extra);
    }

    @DELETE
    // @CacheInvalidate(cacheName = "fetch-extras") 
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteExtras(   @QueryParam("force") Boolean force,
                                    Extras extra) {

        if(force == true)
        {
            System.out.println("pls");
            return orm.deleteExtrasById(extra.getId());
        }
        
        return orm.deleteExtra(extra);
    }


    
}
