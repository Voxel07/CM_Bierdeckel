package orm;

import java.util.ArrayList;
import java.util.List;
import java.lang.reflect.Field;

import model.Order;
import model.OrderItem;
import model.Product;
import model.ExtraItem;
import model.Extras;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.core.Response;

@ApplicationScoped
public class ExtrasOrm {
    
    @Inject
    EntityManager em;

    @Inject
    OrderOrm orderOrm;

    public List<Extras> getExtrasById(Long id) {
        Extras extra = em.find(Extras.class, id);
        List<Extras> extras = new ArrayList<>();
        if (extra != null) {
            extras.add(extra);
        }
        return extras;
    }

    public List<Extras> getAllExtrass() {
        TypedQuery<Extras> query = em.createQuery("SELECT p FROM Extras p", Extras.class);
        return query.getResultList();
    }

    @Transactional
    public Response createExtras(Extras extra) {

        TypedQuery<Long> query = em.createQuery("SELECT COUNT(p) FROM Extras p WHERE p.name = :extraName", Long.class);
        System.out.println(extra.getName());
        query.setParameter("extraName", extra.getName());

        if (query.getSingleResult() != 0L)
        {
            return Response.status(406).entity("Das Extra: "+ extra.getName()+" existiert bereits").build();
        }

        try {
            em.persist(extra);
        }   catch (Exception e)
        {
            return Response.status(500).entity("Fehler beim einfügen des Extras").build();
        }
        
        return Response.status(200).entity("Extra hinzugefügt").build();
    }

    @Transactional
    public Response updateExtras(Extras extra) {

        Extras dBExtras = new Extras();

        try {
            dBExtras = em.find(Extras.class, extra.getId());    
        } catch (Exception e) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity(e).build();
        }

        if (dBExtras == null) {
            return Response.status(406).entity("Extra not found").build();
        }
        
        if(dBExtras.getPrice() != extra.getPrice())
        {
            System.out.println("pls");
            List<Order> orders = orderOrm.getOderByExtras(extra.getId());
            System.out.println(orders.size());

            for (Order order : orders) 
            {
                System.out.println("why");

                for(OrderItem orderItem : order.getOrderItems())
                {
                    System.out.println("why2");

                    for(ExtraItem extraItem : orderItem.getExtraItems())
                    {
                        System.out.println("Ids: " + dBExtras.getId() + " " + extra.getId());

                        if(extraItem.getExtras().getId() == extra.getId())
                        {
                            order.decSum(dBExtras.getPrice());
                            System.out.println("Price: " + dBExtras.getPrice());
                            order.incSum(extra.getPrice());
                            System.out.println("Price2: " + extra.getPrice());
                            try {
                                em.merge(order);
                            } catch (Exception e) {
                                return Response.status(500).entity("Error while updating order").build();
                            }
                            em.flush();
                        }
                    }
                }
            }
        }

        // Set only the updated fields
        Field[] declaredFields = Extras.class.getDeclaredFields();
        for (Field field : declaredFields) {
            field.setAccessible(true); // If required for private fields

            try {
                Object fieldValue = field.get(extra);
                if (fieldValue != null) {
                    field.set(dBExtras, fieldValue);
                }
            } catch (IllegalAccessException e) {
                return Response.status(500).entity("Error accessing field: " + field.getName()).build();
            }
        }

        // try {
        //     em.merge(dBExtras);
        // } catch (Exception e) {
        //     // Handle update error (log, return error response, etc.)
        //     return Response.status(500).entity("Error while updating Extra: " + e.getMessage()).build();
        // }
        

        return Response.status(200).entity("Extra updated").build();

    }

    @Transactional
    public Response deleteExtrasById(Long id) {
         Extras extras;
       
        try {
            extras = em.find(Extras.class, id);
            if (extras.getExtraItem() != null) {
                return Response.status(406).entity("Extra has orders").build();
            }
        } catch (Exception e) {
            return Response.status(500).entity("Error while deleting extras").build();
        }

        try {
            em.remove(extras);
        } catch (Exception e) {
           return Response.status(500).entity("Error while deleting extra").build();
        }
        return Response.status(200).entity("Extra deleted").build();
    }

}
