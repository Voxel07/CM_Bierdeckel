package orm;

import java.util.List;

import jakarta.persistence.EntityManager;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.TypedQuery;

import model.OrderItem.OrderStatus;
import model.OrderItem.PaymentStatus;


import model.OrderItem;
@ApplicationScoped
public class OrderItemOrm {

    @Inject
    EntityManager em;

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
    

    
}
