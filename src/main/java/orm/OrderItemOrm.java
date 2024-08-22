package orm;

import java.util.ArrayList;
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
import model.Product;
import model.OrderItem;
import model.ExtraItem;
import model.Extras;
import model.Order;
import utils.IdExtractor;

@ApplicationScoped
public class OrderItemOrm {

    @Inject
    EntityManager em;

    @Inject
    OrderOrm orderOrm;

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

    public boolean internal_addOrderItem(Long orderId, List<OrderItem> orderItems)
    {
        System.out.println("internal_addOrderItem");
        System.out.println("New order ID: " + orderId);

        Order dbOrder = orderOrm.internal_getOrderById(orderId);

        if (dbOrder == null){
            return false;
        }
        
        for(OrderItem orderItem: orderItems)
        {
            System.out.println("add it pls");
            System.out.println(orderItem.getExtraItems().toString());

            Product productDB = new Product();

            try {
                productDB = em.find(Product.class, orderItem.getProduct().getId());
            } catch (Exception e) {
                System.out.println("Produkt nicht gefunden");
                return false;
            }

            OrderItem newOrderItem = new OrderItem(productDB, dbOrder, OrderItem.PaymentStatus.UNPAID, OrderItem.OrderStatus.ORDERED);

            try {
                em.persist(newOrderItem);
            } catch (Exception e) {
            }
        }

        return true;
    }

    @Transactional
    public Response updateOrderItems(List<OrderItem> orderItems, OrderStatusActions action, OrderStatus directStatus) 
    {
        List<Long>orderItemIds = IdExtractor.extractIds(orderItems);

        List<OrderItem> dbOrderItems;
        try {
            dbOrderItems = em.createQuery("SELECT oi FROM OrderItem oi WHERE oi.id IN :ids", OrderItem.class)
                            .setParameter("ids", orderItemIds)
                            .getResultList();
        } catch (Exception e) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity(e).build();
        }

        if (dbOrderItems.isEmpty()) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity("Keine Artikel gefunden").build();
        }

        List<String> errors = new ArrayList<>();
        for (OrderItem item : dbOrderItems) {
            try {
                if (directStatus != null) {
                        item.setOrderStatus(directStatus);
                } else {
                    updateOrderItemStatus(item, action);
                }
            } catch (IllegalStateException e) {
                errors.add("Fehler bei Artikel ID " + item.getId() + ": " + e.getMessage());
            }
        }

        try {
            em.flush();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Speichern fehlgeschlagen").build();
        }

        if (!errors.isEmpty()) {
            return Response.status(Response.Status.PARTIAL_CONTENT).entity(String.join("\n", errors)).build();
        }

        return Response.ok().entity("Status erfolgreich aktualisiert").build();
    }

    private void updateOrderItemStatus(OrderItem item, OrderStatusActions action) throws IllegalStateException {
        OrderStatus newStatus;
        switch (action) {
            case PROGRESS:
                newStatus = progressStatus(item.getOrderStatus());
                break;
            case RETROGRESS:
                newStatus = regressStatus(item.getOrderStatus());
                break;
            default:
                throw new IllegalStateException("Ungültige Aktion");
        }
        item.setOrderStatus(newStatus);
    }

    private OrderStatus progressStatus(OrderStatus currentStatus) throws IllegalStateException {
        switch (currentStatus) {
            case ORDERED:
                return OrderStatus.IN_PROGRESS;
            case IN_PROGRESS:
                return OrderStatus.DELIVERED;
            case DELIVERED:
                throw new IllegalStateException("Das ist wohl das Ende");
            default:
                throw new IllegalStateException("Ungültiger Status");
        }
    }

    private OrderStatus regressStatus(OrderStatus currentStatus) throws IllegalStateException {
        switch (currentStatus) {
            case DELIVERED:
                return OrderStatus.IN_PROGRESS;
            case IN_PROGRESS:
                return OrderStatus.ORDERED;
            case ORDERED:
                throw new IllegalStateException("Das ist wohl das Ende");
            default:
                throw new IllegalStateException("Ungültiger Status");
        }
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
        System.out.println("removeExtraFromOrderItem");

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
