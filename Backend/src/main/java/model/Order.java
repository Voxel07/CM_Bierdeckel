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
@Table(name = "REQUEST")
public class Order {

    @Id
    @SequenceGenerator(name = "requestSeq", sequenceName = "ZSEQ_REQUEST_ID", allocationSize = 1, initialValue = 1)
    @GeneratedValue(generator = "requestSeq")
    @Column(name = "id", unique = true, nullable = false)
    private Long id;

    @Column(name = "sum")
    private double sum;

    @Column(name = "state")
    private long state;

    @OneToMany(mappedBy = "order", cascade = {CascadeType.ALL},fetch=FetchType.LAZY)
    private List<Product> products;

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

    public void addProduct(Product p){
        if(products == null){
            products = new ArrayList<>();
        }
        products.add(p);
    }

    public void removeProduct(Product p){
        if(products != null){
            products.remove(p);
        }
    }   
}
