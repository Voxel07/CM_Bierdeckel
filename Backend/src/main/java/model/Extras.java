package model;

import java.util.ArrayList;
import java.util.List;

import jakarta.json.bind.annotation.JsonbTransient;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
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

    @Column(name = "category")
    private String category;

    @OneToMany(mappedBy = "extras", cascade = {CascadeType.MERGE, CascadeType.PERSIST}, fetch = FetchType.LAZY)
    private List<ExtraItem> extraItem = new ArrayList<>();

    public Extras() {
    }

    public Extras(String name, Double price, String category) {
        this.name = name;
        this.price = price;
        this.category = category;
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

    @JsonbTransient
    public List<ExtraItem> getExtraItem() {
        return extraItem;
    }

    public void setExtraItem(List<ExtraItem> extraItem) {
        this.extraItem = extraItem;
    }

}
