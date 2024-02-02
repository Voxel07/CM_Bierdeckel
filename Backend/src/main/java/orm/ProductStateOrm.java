package orm;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.core.Response;

import model.ProductState;
import model.Request;
import model.ProductState.OrderStatus;
import model.ProductState.PaymentStatus;

@ApplicationScoped
public class ProductStateOrm {

    @Inject
    EntityManager em;

    @Transactional
    public Response setPaymentStatus(ProductState productState) 
    {
        Request request = em.find(Request.class, productState.getRequest().getId());
        if (request == null) {
            return Response.status(404).entity("Request mit der ID: " + "requestId" + " nicht gefunden").build();
        }

        try {
            em.persist(productState);
        } catch (Exception e) {
            return Response.status(500).entity("Fehler beim ändern des ProductStates").build();
        }
        return Response.status(200).entity("ProductState mit der ID: " + "requestId" + " wurde geändert").build();
    }

    @Transactional
    public Response setOrderStatus(ProductState productState) 
    {
        Request request = em.find(Request.class, productState.getRequest().getId());

        if (productState == null) {
            return Response.status(404).entity("ProductState mit der ID: " + "requestId" + " nicht gefunden").build();
        }
        // productState.setOrderStatus(status);
        return Response.status(200).entity("ProductState mit der ID: " + "requestId" + " wurde geändert").build();
    }

    public boolean createProductState(ProductState productState)
    {
        try {
            em.persist(productState);
        } catch (Exception e) {
            return false;
        }
        return true;
    }


    
}
