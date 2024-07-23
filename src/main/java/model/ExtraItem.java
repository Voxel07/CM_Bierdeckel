package model;

import jakarta.json.bind.annotation.JsonbTransient;


import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name ="orderItem_id", referencedColumnName="id")
    private OrderItem orderItem;

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

    @JsonbTransient
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
