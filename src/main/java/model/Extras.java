package model;

import java.util.List;
import java.util.ArrayList;
import java.util.Set;
import java.util.HashSet;

import jakarta.json.bind.annotation.JsonbTransient;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;

@Entity
@Table(name = "EXTRAS")
public class Extras {
    
    @Id
    @SequenceGenerator(name = "extrasSeq", sequenceName = "ZSEQ_EXTRAS_ID", allocationSize = 1, initialValue = 1)
    @GeneratedValue(generator = "extrasSeq")
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

    @OneToMany(mappedBy = "extras", cascade = {CascadeType.MERGE, CascadeType.PERSIST}, fetch = FetchType.LAZY)
    private List<ExtraItem> extraItem = new ArrayList<>();

    @ManyToMany(mappedBy = "extras", fetch = FetchType.LAZY)
    private List<Product> products = new ArrayList<>();

    public Extras() {
    }

    public Extras(String name, Double price, String category, Long stock, Long consumption) {
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

    @JsonbTransient
    public List<ExtraItem> getExtraItem() {
        return extraItem;
    }

    public void setExtraItem(List<ExtraItem> extraItem) {
        this.extraItem = extraItem;
    }

    public void addProduct(Product product) {
        this.products.add(product);
        product.getCompatibleExtras().add(this);
    }

    public void removeProduct(Product product) {
        this.products.remove(product);
        product.getCompatibleExtras().remove(this);
    }

    @JsonbTransient
    public List<Product> getCompatibleProducts() {
        return this.products;
    }

    // Setter for products
    public void setCompatibleProducts(List<Product> products) {
        this.products = products;
    }

    @Override
    public String toString() {
        return "Extras [id=" + id + ", name=" + name + ", price=" + price + ", stock=" + stock + ", consumption="
                + consumption + ", category=" + category + ", extraItem=" + extraItem + ", products=" + products + "]";
    }

}
