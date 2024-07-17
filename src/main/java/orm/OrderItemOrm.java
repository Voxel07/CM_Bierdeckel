package orm;

import java.util.List;

import jakarta.persistence.EntityManager;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.core.Response;
import model.OrderItem.OrderStatus;
import model.OrderItem.OrderStatusActions;
import model.OrderItem.PaymentStatus;

import model.OrderItem;
import model.Order;

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

    @Transactional
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

        if(action == OrderStatusActions.PROGRESS)
        {
            switch (dbOrderItem.getOrderStatus()) {
                case ORDERED:
                    dbOrderItem.setOrderStatus(OrderStatus.IN_PROGRESS);
                    break;
                case IN_PROGRESS:
                    dbOrderItem.setOrderStatus(OrderStatus.DELIVERED);
                    break;
                case DELIVERED:
                    return Response.status(Response.Status.EXPECTATION_FAILED).entity("Das ist wohl das Ende").build();
                default:
                    return Response.status(Response.Status.EXPECTATION_FAILED).entity("Invalid status").build();
            }
        }
        else if(action == OrderStatusActions.RETROGRESS)
        {
            switch (dbOrderItem.getOrderStatus()) {
                case DELIVERED:
                    dbOrderItem.setOrderStatus(OrderStatus.IN_PROGRESS);
                    break;
                case IN_PROGRESS:
                    dbOrderItem.setOrderStatus(OrderStatus.ORDERED);
                    break;
                case ORDERED:
                    return Response.status(Response.Status.EXPECTATION_FAILED).entity("Das ist wohl das Ende").build();
                default:
                    return Response.status(Response.Status.EXPECTATION_FAILED).entity("Invalid status").build();
            }
        }

        try {
            em.merge(dbOrderItem);
        } catch (Exception e) {
            System.err.println(e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Speichern Fehlgschlagen").build();
        }

        return Response.ok().entity("Status erfolgreich aktualisiert").build();
    }
}
