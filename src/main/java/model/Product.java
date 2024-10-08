package model;

import java.util.Set;
import java.util.HashSet;
import java.util.List;
import java.util.ArrayList;

import jakarta.json.bind.annotation.JsonbTransient;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.OneToMany;
import jakarta.persistence.FetchType;

@Entity
@Table(name = "PRODUCTS")
public class Product {

    @Id
    @SequenceGenerator(name = "productSeq", sequenceName = "ZSEQ_PRODUCT_ID", allocationSize = 1, initialValue = 1)
    @GeneratedValue(generator = "productSeq")
    @Column(name = "id", unique = true, nullable = false)
    private Long id;

    @Column(name = "name", unique = true)
    private String name;

    @Column(name = "price")
    private Double price;

    @Column(name = "stock")
    private Long stock;

    @Column(name = "consumption")
    private Long consumption;

    @Column(name = "category")
    private String category;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<OrderItem> orderItems = new ArrayList<>();

    @ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
        name = "PRODUCT_EXTRAS",
        joinColumns = @JoinColumn(name = "product_id"),
        inverseJoinColumns = @JoinColumn(name = "extras_id")
    )
    private List<Extras> extras = new ArrayList<>();

    public Product() {
    }

    public Product(String name, Double price, String category, Long stock, Long consumption) {
        this.name = name;
        this.price = price;
        this.category = category;
        this.stock = stock;
        this.consumption = consumption;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Long getStock() {
        return stock;
    }

    public void setStock(Long stock) {
        this.stock = stock;
    }

    public void incStock(Long ammount){
        this.stock +=ammount;
    }

    public void decStock(Long ammount){
        this.stock -=ammount;
    }


    public Long getConsumption() {
        return consumption;
    }

    public void setConsumption(Long consumption) {
        this.consumption = consumption;
    }

    public void incConsumption()
    {
        this.consumption ++;
    }

    public void decConsumption()
    {
        this.consumption --;
    }

    @JsonbTransient
    public List<OrderItem> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(List<OrderItem> orderItems) {
        this.orderItems = orderItems;
    }

    public void addExtra(Extras extra) {
        this.extras.add(extra);
        extra.getCompatibleProducts().add(this);
    }

    public void removeExtra(Extras extra) {
        this.extras.remove(extra);
        extra.getCompatibleProducts().remove(this);
    }

    // @JsonbTransient
    public List<Extras> getCompatibleExtras() {
        return this.extras;
    }

    // Setter for extras
    public void setCompatibleExtras(List<Extras> extras) {
        this.extras = extras;
    }

    @Override
    public String toString() {
        return "Product [id=" + id + ", name=" + name + ", price=" + price + ", stock=" + stock + ", consumption="
                + consumption + ", category=" + category + "]";
    }

    
}

