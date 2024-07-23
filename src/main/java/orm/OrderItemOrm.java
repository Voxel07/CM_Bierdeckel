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
import model.ExtraItem;
import model.Extras;
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

    public List <OrderItem> getOrderItemsByProductCategory(String category)
    {
        System.out.println("category");
        TypedQuery<OrderItem> query = em.createQuery("SELECT oi FROM OrderItem oi WHERE oi.product.category = :cat ", OrderItem.class);
        query.setParameter("cat", category);
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

     @Transactional
    public Response addExtraToOrderItem(Long orderItemId, Long extraId) {

        System.out.println("addExtraToOrder2");

        OrderItem orderItemDb = new OrderItem();
        Extras extraDB = new Extras();

        try {
            orderItemDb = em.find(OrderItem.class, orderItemId);
        } catch (Exception e) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity(e).build();
        }

        if (orderItemDb == null) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity("OrderItem not found").build();
        }

        try {
            extraDB = em.find(Extras.class, extraId);
        } catch (Exception e) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity(e).build();
        }

        if (extraDB == null) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity("Extra not found").build();
        }

        ExtraItem extra = new ExtraItem(orderItemDb, extraDB);
        orderItemDb.addExtraItem(extra);

        try {
            System.out.println("merge");

            em.merge(orderItemDb);
        } catch (Exception e) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity(e).build();
        }

        return Response.status(Response.Status.CREATED).entity("Extra added to order").build();
    }

    @Transactional
    public Response removeExtraFromOrderItem(Long orderItemId, Long extraId)
    {
        System.out.println("addProductToOrder");

        OrderItem orderItemDb = new OrderItem();

        try {
            orderItemDb = em.find(OrderItem.class, orderItemId);
        } catch (Exception e) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity(e).build();
        }

        if (orderItemDb == null) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity("OrderItem not found").build();
        }

        Boolean itemFound = false;
        // only remove the first item found
        for (ExtraItem ei : orderItemDb.getExtraItems()) {
            if (ei.getExtras().getId() == extraId) {
                // em.remove(orderItem); // Remove the OrderItem from the database
                orderItemDb.removeExtraItem(ei);
                itemFound = true;
                break;
            }
        }

        if (!itemFound) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity("Extra not found").build();
        }

        try {
            em.merge(orderItemDb);
        } catch (Exception e) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity(e).build();
        }

        return Response.status(Response.Status.CREATED).entity("Extra removed from order").build();
    }
}
