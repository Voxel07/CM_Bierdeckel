package orm;

import java.util.List;
import model.Product;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

import jakarta.persistence.TypedQuery;

@ApplicationScoped
public class ProductOrm {
    
    @Inject
    EntityManager em;

    public Product getProductById(Long id) {
        return em.find(Product.class, id);
    }

    public List<Product> getAllProducts() {
        TypedQuery<Product> query = em.createQuery("SELECT p FROM Product p", Product.class);
        return query.getResultList();
    }

    public void createProduct(Product product) {
        em.persist(product);
    }

    public void updateProduct(Product product) {
        em.merge(product);
    }

    public void deleteProductById(Long id) {
        Product product = em.find(Product.class, id);
        em.remove(product);
    }

}
