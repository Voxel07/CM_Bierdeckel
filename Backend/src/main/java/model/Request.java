package model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.OneToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.json.bind.annotation.JsonbTransient;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "REQUEST")
public class Request {

    @Id
    @SequenceGenerator(name = "requestSeq", sequenceName = "ZSEQ_REQUEST_ID", allocationSize = 1, initialValue = 1)
    @GeneratedValue(generator = "requestSeq")
    @Column(name = "id", unique = true, nullable = false)
    private Long id;

    @Column(name = "sum")
    private double sum;

    @ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.ALL})
    @JoinTable(
                name = "request_product",
                joinColumns = {@JoinColumn(name = "requestId", referencedColumnName="id")},
                inverseJoinColumns = {@JoinColumn(name = "productId", referencedColumnName="id")}
                )

    private  List<Product> products = new ArrayList<>();

    @OneToOne(cascade = CascadeType.ALL, fetch=FetchType.LAZY)
    @JoinColumn(name = "userId", referencedColumnName = "id")
    private User user;

    @OneToMany(mappedBy = "request", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProductState> productStates = new ArrayList<>();

    public Request(){

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
    public List<Product> getProducts() {
        return products;
    }

    public void addProduct(Product product) {
        this.products.add(product);
        this.sum += product.getPrice();
    }

    public void removeProduct(Product product) {
        this.products.remove(product);
        this.sum -= product.getPrice();
    }

    public void setProducts(List<Product> products) {
        this.products = products;
    }

    // @JsonIgnore
    public User getUser() {
        return user;
    }

    public void setUser(User user){
        this.user = user;
    }
}
