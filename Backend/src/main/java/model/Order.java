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

@Entity
@Table(name = "REQUESTS") // Cant be named Order because it is a reserved word in SQL
public class Order {

    @Id
    @SequenceGenerator(name = "orderSeq", sequenceName = "ZSEQ_ORDERS_ID", allocationSize = 1, initialValue = 1)
    @GeneratedValue(generator = "orderSeq")
    @Column(name = "id", unique = true, nullable = false)
    private Long id;

    @Column(name = "sum")
    private double sum;

    @OneToMany(cascade = CascadeType.ALL, fetch=FetchType.LAZY, mappedBy = "order", orphanRemoval = true)
    private List<OrderItem> orderItems = new ArrayList<>();

    @OneToOne(cascade = CascadeType.ALL, fetch=FetchType.LAZY)
    @JoinColumn(name = "userId", referencedColumnName = "id")
    private User user;

    public Order(){

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

    @JsonbTransient
    public List<OrderItem> getOrderItems() {
        return orderItems;
    }

    public void addOrderItem(OrderItem orderItem) {
        this.orderItems.add(orderItem);
        this.sum += orderItem.getProduct().getPrice();
    }

    public void removeOrderItem(OrderItem orderItem) {
        this.orderItems.remove(orderItem);
        this.sum -= orderItem.getProduct().getPrice();
        if (this.sum < 0 || this.orderItems.size() == 0){
            this.sum = 0;
        }
    }

    public void setOrderItemPay(OrderItem orderItem, PaymentStatus paymentStatus) {
        orderItem.setPaymentStatus(paymentStatus);
    }

    public void payOrder(){
        for (OrderItem orderItem : this.orderItems) {
            orderItem.setPaymentStatus(OrderItem.PaymentStatus.PAID);
        }
        this.sum = 0;
    }

    public void setOrderItemState(OrderItem orderItem, OrderStatus orderStatus){
        orderItem.setOrderStatus(orderStatus);
    }

    public void setOrderItems(List<OrderItem> orderItems) {
        this.orderItems = orderItems;
    }

    // @JsonIgnore
    public User getUser() {
        return user;
    }

    public void setUser(User user){
        this.user = user;
    }
}
