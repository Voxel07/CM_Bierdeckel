package orm;

import java.util.List;

import jakarta.persistence.EntityManager;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.TypedQuery;
import jakarta.ws.rs.core.Response;
import model.OrderItem.OrderStatus;
import model.OrderItem.PaymentStatus;


import model.OrderItem;
@ApplicationScoped
public class OrderItemOrm {

    @Inject
    EntityManager em;

    public List<OrderItem> getAllOrderitems()
    {
        TypedQuery<OrderItem> query = em.createQuery("SELECT oi from OrderItem oi", OrderItem.class);
        return query.getResultList();
    }

    public List<OrderItem> getOrderItemsByPaymentStatus(PaymentStatus status) {
        TypedQuery<OrderItem> query = em.createQuery("SELECT o FROM OrderItem o WHERE o.paymentStatus = :status", OrderItem.class);
        query.setParameter("status", status);
        return query.getResultList();
    }

    public List<OrderItem> getOrderItemsByOrderStatus(OrderStatus status) {
        TypedQuery<OrderItem> query = em.createQuery("SELECT o FROM OrderItem o WHERE o.orderStatus = :status", OrderItem.class);
        query.setParameter("status", status);
        return query.getResultList();
    }

    public Response updateOrderItemState(Long orderItemId, OrderStatusActions action)
    {
        OrderItem dbOrderItem;

        try {
            dbOrderItem = em.find(OrderItem.class, orderItemId);
        } catch (Exception e) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity(e).build();
        }

        if (dbOrderItem == null) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity("Artikel nicht gefunden").build();
        }

        Order dbOrder = dbOrderItem.getOrder();

        if(dbOrderItem.getOrderStatus().equals(orderItem.getOrderStatus()))
        {
            return Response.status(Response.Status.NOT_MODIFIED).entity("Status hat sich nicht geändert").build();
        }

        if(action == PROGRESS)
        {
            switch (orderItem.getOrderStatus()) {
                case ORDERED:
                    dbOrderItem.setOrderStatus(IN_PROGRESS)
                    break;
                case IN_PROGRESS:
                    dbOrderItem.setOrderStatus(DELIVERED)
                    break;
                case DELIVERED:
                    return Response.status(Response.Status.EXPECTATION_FAILED).entity("Order item state limit reached").build();
                    break;
                default:
                    return Response.status(Response.Status.EXPECTATION_FAILED).entity("Invalid status").build();
            }
        }
        else if(action == RETROGRESS)
        {
            switch (orderItem.getOrderStatus()) {
                case DELIVERED:
                    dbOrderItem.setOrderStatus(IN_PROGRESS)
                    break;
                case IN_PROGRESS:
                    dbOrderItem.setOrderStatus(ORDERED)
                    break;
                case ORDERED:
                    return Response.status(Response.Status.EXPECTATION_FAILED).entity("Order item state limit reached").build();
                    break;
                default:
                    return Response.status(Response.Status.EXPECTATION_FAILED).entity("Invalid status").build();
            }
        }

        try {
            em.merge(dbOrderItem);
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Speichern Fehlgschlagen").build();
        }

        return Response.ok().entity("Element erfolgreich aktualisiert").build();
    }
    
}
