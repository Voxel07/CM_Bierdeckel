package resources;
import java.util.List;
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
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public List<Extras> getAllExtras(@QueryParam("extrasId") Long extrasId) {
        if (extrasId != null) {
            return orm.getExtrasById(extrasId);
        } else {
            return orm.getAllExtrass();
        }
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createExtras(Extras extra) {
        return orm.createExtras(extra);
    }

    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateExtras(Extras extra) {
        return orm.updateExtras(extra);
    }

    @DELETE
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteExtras(Long id) {
        return orm.deleteExtrasById(id);
    }


    
}
