package model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import model.OrderItem.OrderStatus;
import model.OrderItem.PaymentStatus;
import jakarta.persistence.OneToMany;
import jakarta.json.bind.annotation.JsonbTransient;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "REQUESTS") // Cant be named Order because it is a reserved word in SQL
public class Order {

    @Id
    @SequenceGenerator(name = "orderSeq", sequenceName = "ZSEQ_ORDERS_ID", allocationSize = 1, initialValue = 10) //TODO: Chachge back to 1
    @GeneratedValue(generator = "orderSeq")
    @Column(name = "id", unique = true, nullable = false)
    private Long id;

    @Column(name = "sum")
    private double sum;

    @Column(name = "order_paid" )
    private Boolean orderPaid;

    @Column(name = "order_delivered")
    private Boolean orderDelivered;

    @Column(name = "order_completed")
    private Boolean orderCompleted;

    @OneToMany(cascade = {CascadeType.MERGE, CascadeType.PERSIST}, fetch=FetchType.LAZY, mappedBy = "order", orphanRemoval = true)
    private List<OrderItem> orderItems = new ArrayList<>();

    // @OneToMany(cascade = CascadeType.ALL, fetch=FetchType.LAZY, mappedBy = "order", orphanRemoval = true)
    // private List<ExtraItem> extraItems = new ArrayList<>();

    @OneToOne(cascade = CascadeType.ALL, fetch=FetchType.LAZY)
    @JoinColumn(name = "userId", referencedColumnName = "id")
    private User user;

    public Order(){
    }



    public Order(double sum, Boolean orderPaid, Boolean orderDelivered, Boolean orderCompleted,
            List<OrderItem> orderItems, User user) {
        this.sum = sum;
        this.orderPaid = orderPaid;
        this.orderDelivered = orderDelivered;
        this.orderCompleted = orderCompleted;
        this.orderItems = orderItems;
        this.user = user;
    }



    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public double getSum() {
        return sum;
    }

    public void setSum(double sum) {
        this.sum = sum;
    }

    public void incSum(double sum) {
        this.sum += sum;
    }

    public void decSum(double sum) {
        this.sum -= sum;
    }

    public Boolean isOrderPaid() {
        return orderPaid;
    }

    public void setOrderPaid(Boolean orderPaid) {
        this.orderPaid = orderPaid;
    }

    public Boolean isOrderDelivered() {
        return orderDelivered;
    }

    public void setOrderDelivered(Boolean orderDelivered) {
        this.orderDelivered = orderDelivered;
    }

    public Boolean isOrderCompleted() {
        return orderCompleted;
    }

    public void setOrderCompleted(Boolean orderCompleted) {
        this.orderCompleted = orderCompleted;
    }

    // @JsonbTransient
    public List<OrderItem> getOrderItems() {
        return orderItems;
    }

    @JsonbTransient
    public OrderItem getOrderItemById(Long id){
        for (OrderItem orderItem : this.orderItems) {
            if (orderItem.getId() == id){
                return orderItem;
            }
        }
        return null;
    }

    public void addOrderItem(OrderItem orderItem) {
        this.orderItems.add(orderItem);
        this.sum += orderItem.getProduct().getPrice();
        orderItem.getProduct().incConsumption();
    }

    public void removeOrderItem(OrderItem orderItem) {
        this.orderItems.remove(orderItem);
        this.sum -= orderItem.getProduct().getPrice();
        if (this.sum < 0 || this.orderItems.size() == 0){
            this.sum = 0;
        }
        orderItem.getProduct().decConsumption();
    }

    public void setOrderItemPay(OrderItem orderItem, PaymentStatus paymentStatus) {
        orderItem.setPaymentStatus(paymentStatus);
    }

    public void payOrder(){
        for (OrderItem orderItem : this.orderItems) {
            orderItem.setPaymentStatus(OrderItem.PaymentStatus.PAID);
        }
        this.sum = 0;
        orderPaid = true;
    }

    public void completeOrder(){
        for (OrderItem orderItem : this.orderItems) {
            orderItem.setOrderStatus(OrderItem.OrderStatus.DELIVERED);
        }
        orderCompleted = true;
    }

    public void setOrderItems(List<OrderItem> orderItems) {
        this.orderItems = orderItems;
    }

    @JsonManagedReference
    @JsonBackReference
    public User getUser() {
        return user;
    }

    public void setUser(User user){
        this.user = user;
    }
}
