package model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.FetchType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;

@Entity
@Table(name = "ORDER_ITEMS")  
public class OrderItem
{
    @Id
    @SequenceGenerator(name = "orderItemsSeq", sequenceName = "ZSEQ_ORDER_ITEMS_ID", allocationSize = 1, initialValue = 1)
    @GeneratedValue(generator = "orderItemsSeq")
    @Column(name = "id", unique = true, nullable = false)
    private int id;

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name ="prduct_id", referencedColumnName="id")
    private Product product;

    @ManyToOne(targetEntity = Order.class, cascade = CascadeType.ALL, fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", referencedColumnName = "id")
    private Order order;

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

    public OrderItem() {
    }

    public OrderItem(Product product, Order order, PaymentStatus paymentStatus, OrderStatus orderStatus) {
        this.product = product;
        this.order = order;
        this.paymentStatus = paymentStatus;
        this.orderStatus = orderStatus;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    @JsonIgnore
    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
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


    
    

}
