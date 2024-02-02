package model;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.persistence.Column;


@Entity
@Table(name = "PRODUCT_STATE")
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

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "productId", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "orderId", referencedColumnName = "id")
    private Order order;

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

    public ProductState() {
    }

    public ProductState(PaymentStatus paymentStatus, OrderStatus orderStatus, Product product, Order order) {
        this.paymentStatus = paymentStatus;
        this.orderStatus = orderStatus;
        this.product = product;
        this.order = order;
    }

    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public OrderStatus getOrderStatus() {
        return orderStatus;
    }

    public void setOrderStatus(OrderStatus orderStatus) {
        this.orderStatus = orderStatus;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    
}
