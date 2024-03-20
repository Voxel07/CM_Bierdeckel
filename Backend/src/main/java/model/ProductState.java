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
    @JoinColumn(name = "requestId", referencedColumnName = "id")
    private Request request;

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

    public ProductState(PaymentStatus paymentStatus, OrderStatus orderStatus, Product product, Request request) {
        this.paymentStatus = paymentStatus;
        this.orderStatus = orderStatus;
        this.product = product;
        this.request = request;
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

    public Request getRequest() {
        return request;
    }

    public void setRequest(Request request) {
        this.request = request;
    }

    
}
