package orm;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

import model.Order;
import model.Product;

@ApplicationScoped
public class OrderOrm {

    @Inject
    EntityManager em;

    public void createOrder(Order order) {
        em.persist(order);
    }

    public Order getOrderById(Long id) {
        return em.find(Order.class, id);
    }

    public void updateOrder(Order order) {
        em.merge(order);
    }

    public void addProductToOrder(Product product) {
        // em.merge(product);
    }

    public void removeProductFromOrder(Product product) {
        // em.merge(product);
    }

    public void deleteOrder(Order order) {
        em.remove(order);
    }

}
