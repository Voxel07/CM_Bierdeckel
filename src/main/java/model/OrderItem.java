package model;

import java.util.ArrayList;
import java.util.List;

import jakarta.json.bind.annotation.JsonbTransient;

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
import jakarta.persistence.OneToMany;

@Entity
@Table(name = "ORDER_ITEMS")  
public class OrderItem
{
    @Id
    @SequenceGenerator(name = "orderItemsSeq", sequenceName = "ZSEQ_ORDER_ITEMS_ID", allocationSize = 1, initialValue = 1)
    @GeneratedValue(generator = "orderItemsSeq")
    @Column(name = "id", unique = true, nullable = false)
    private int id;

    @Column(name = "payment_status")
    private PaymentStatus paymentStatus;
    
    @Column(name = "order_status")
    private OrderStatus orderStatus;
    
    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name ="prduct_id", referencedColumnName="id")
    private Product product;

    // @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    // @JoinColumn(name ="extraItem_id", referencedColumnName="id")
    // private ExtraItem extraItem;

    @OneToMany(mappedBy = "orderItem", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<ExtraItem> extraItems = new ArrayList<>();
    
    @ManyToOne(targetEntity = Order.class, cascade = CascadeType.ALL, fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", referencedColumnName = "id")
    private Order order;
    
    public enum PaymentStatus {
        UNPAID,
        PARTIALLY_PAID, //only an order can be partially paid
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

    @JsonbTransient
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

    // @JsonbTransient
    public List<ExtraItem> getExtraItems() {
        return extraItems;
    }

    public void setExtraItems(List<ExtraItem> extraItems) {
        this.extraItems = extraItems;
        for (ExtraItem extraItem : extraItems) {
            this.order.incSum(extraItem.getExtras().getPrice());
        }
    }

    public void addExtraItem(ExtraItem extraItem) {
        this.extraItems.add(extraItem);
        this.order.incSum(extraItem.getExtras().getPrice());
    }

    public void removeExtraItem(ExtraItem extraItem) {
        this.extraItems.remove(extraItem);
        this.order.decSum(extraItem.getExtras().getPrice());
    }

    public void removeAllExtraItems() {
        this.extraItems.clear();
        for (ExtraItem extraItem : extraItems) {
            this.order.decSum(extraItem.getExtras().getPrice());
        }
    }

    @Override
    public String toString() {
        return "OrderItem{" +
                "id=" + id +
                ", product=" + product +
                ", order=" + order +
                ", paymentStatus=" + paymentStatus +
                ", orderStatus=" + orderStatus +
                '}';
    }
    
    

}
