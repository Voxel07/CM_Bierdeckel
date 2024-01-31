package model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;

@Entity
public class ProductState {
    
    @Id
    @SequenceGenerator(name = "productStateSeq", sequenceName = "ZSEQ_PRODUCT_STATE_ID", allocationSize = 1, initialValue = 1)
    @GeneratedValue(generator = "productStateSeq")
    @Column(name = "id", unique = true, nullable = false)
    private Long id;

    @Column(name = "payment_status")
    private PaymentStatus paymentStatus;
    
    @Column(name = "order_status")
    private OrderStatus orderStatus;

    public enum PaymentStatus {
        UNPAID,
        PARTIALLY_PAID,
        PAID
    }

    public enum OrderStatus {
        ORDERED,
        IN_PROGRESS,
        DELIVERED
    }


    
    
}
