package model;

import java.util.List;
import java.util.ArrayList;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;

@Entity
@Table(name = "EXTRA_ITEMS")
public class ExtraItem {

    @Id
    @SequenceGenerator(name = "extraItemSeq", sequenceName = "ZSEQ_EXTRA_ITEMS_ID", allocationSize = 1, initialValue = 1)
    @GeneratedValue(generator = "extraItemSeq")
    @Column(name = "id", unique = true, nullable = false)
    private Long id;

    //OrderId ManyExtraItems one Oder
    // @ManyToOne(targetEntity = Order.class, cascade = CascadeType.ALL, fetch = FetchType.LAZY, optional = false)
    // @JoinColumn(name = "order_id", referencedColumnName = "id")
    // private Order order;


    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name ="orderItem_id", referencedColumnName="id")
    private OrderItem orderItem;

    //OrderItemId //ManyExtraItems one OrderItem
    // @OneToMany(mappedBy = "extraItem", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    // private List<OrderItem> orderItem = new ArrayList<>();

    //ExtrasId //
    @ManyToOne(cascade = {CascadeType.MERGE, CascadeType.PERSIST}, fetch = FetchType.LAZY)
    @JoinColumn(name ="extra_id", referencedColumnName="id")
    private Extras extras;

    public ExtraItem() {
    }

    public ExtraItem(OrderItem orderItem, Extras extras) {
        this.orderItem = orderItem;
        this.extras = extras;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @JsonIgnore
    public OrderItem getOrderItem() {
        return orderItem;
    }

    public void setOrderItem(OrderItem orderItem) {
        this.orderItem = orderItem;
    }

    public Extras getExtras() {
        return extras;
    }

    public void setExtras(Extras extras) {
        this.extras = extras;
    }

    @Override
    public String toString() {
        return "ExtraItem{" +
                "id=" + id +
                ", orderItem=" + orderItem +
                ", extras=" + extras +
                '}';
    }
}
