package model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ORDER")
public class Order {

    @Id
    @SequenceGenerator(name="orderSeq", sequenceName = "ZSEQ_ORDER_ID", allocationSize = 1, initialValue = 1)
    @GeneratedValue(generator = "orderSeq")
    @Column(name = "id", unique = true, nullable = false)
    private Long id;

    @Column(name = "SUM")
    private double sum;

    @Column(name = "state")
    private long state;

    @OneToMany(mappedBy = "order")
    private List<Product> products;

    @OneToMany(mappedBy="order", cascade = {CascadeType.ALL},fetch=FetchType.LAZY )
	private List<Product> phones = new ArrayList<>();

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    public Order(){

    }

    public Order(double sum, long state) {
        this.sum = sum;
        this.state = state;
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

    public long getState() {
        return state;
    }

    public void setState(long state) {
        this.state = state;
    }

    public List<Product> getProducts() {
        return products;
    }

    public void setProducts(List<Product> products) {
        this.products = products;
    }
}
