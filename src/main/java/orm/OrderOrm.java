package orm;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import java.util.HashMap;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.core.Response;

import model.Order;
import model.OrderItem;
import model.Product;
import model.User;
import model.OrderItem.PaymentStatus;
import model.OrderItem.OrderStatus;

@ApplicationScoped
public class OrderOrm {

    @Inject
    EntityManager em;

    @Inject
    OrderItemOrm orderItemOrm;

    public Response getOrderById(Long id) {
        Order order = em.find(Order.class, id);
        List<Order> orders = new ArrayList<>();
        if (order != null) {
            orders.add(order);
        }
        return Response.status(Response.Status.OK).entity(orders).build();
    }

    public Order internal_getOrderById(Long id) {
        Order dbOrder;

        try {
            dbOrder = em.find(Order.class, id);
        } catch (Exception e) {
           return null;
        }

        return dbOrder;
         
    }

    public Response getAllOrder() {
        TypedQuery<Order> query = em.createQuery("SELECT r FROM Order r", Order.class);

        try {
            return Response.status(Response.Status.OK).entity(query.getResultList()).build();

        } catch (Exception e) {
            return  Response.status(Response.Status.OK).entity(new ArrayList<>()).build();
        }
    }

    public Order getOpenOrderByUser(Long userId)
    {
        TypedQuery<Order> query = em.createQuery("SELECT o FROM Order o WHERE o.user.id = :val AND o.orderCompleted = false", Order.class);
        query.setParameter("val", userId);

        try {
            return query.getSingleResult();
        } catch (NoResultException  e) {
            return null;
        }
    }

    public List<Order> getOrdersByPaymentState(Boolean state)
    {
        TypedQuery<Order> query = em.createQuery("SELECT o FROM Order o WHERE o.orderPaid =: paystate", Order.class);
        query.setParameter("paystate", state);
        return query.getResultList();
    }

    public List<Order> getOrdersByCompletionState(Boolean state)
    {
        TypedQuery<Order> query = em.createQuery("SELECT o FROM Order o WHERE o.orderCompleted =: completionState", Order.class);
        query.setParameter("completionState", state);
        return query.getResultList();
    }

    public Response getOderByUser(Long userId, Boolean completedOrder)
    {
        TypedQuery<Order> query = em.createQuery("SELECT o FROM Order o WHERE o.user.id = :val AND o.orderCompleted = :orderState", Order.class);
        query.setParameter("val", userId);
        query.setParameter("orderState", completedOrder);
        
        try {
            return Response.status(Response.Status.OK).entity(query.getResultList()).build();

        } catch (Exception e) {
            return  Response.status(Response.Status.OK).entity(new ArrayList<>()).build();
        }
    }

    public List<Order> getOderByProducts(Long productId) {
        TypedQuery<Order> query = em.createQuery("SELECT r FROM Order r JOIN r.orderItems o WHERE o.product.id = :productId", Order.class);
        query.setParameter("productId", productId);

        return query.getResultList();
    }

    public List<Order> getOderByExtras(Long extraId) {
        TypedQuery<Order> query = em.createQuery("SELECT o FROM Order o JOIN o.orderItems oi JOIN oi.extraItems ei WHERE ei.extras.id = :extraId", Order.class);
        query.setParameter("extraId", extraId);

        return  query.getResultList();
    }

    @Transactional
    public Response createOrder(Long userId, List<OrderItem> orderItems) {
        System.out.println("createOrder");

        Order order = new Order();
        User user;
    
        try {
            user = em.find(User.class, userId);
            if (user == null) {
                return Response.status(Response.Status.NOT_FOUND).entity("User not found").build();
            }
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Error finding user: " + e.getMessage()).build();
        }
    
        TypedQuery<Order> query = em.createQuery("SELECT o FROM Order o WHERE o.user = :user AND o.orderCompleted = false", Order.class);
        query.setParameter("user", user);
    
        if (!query.getResultList().isEmpty()) {
            return Response.status(Response.Status.CONFLICT).entity("User already has an order. Please update the existing order.").build();
        }
    
        order.setUser(user);
        order.setOrderCompleted(false);
        order.setOrderDelivered(false);
        order.setOrderPaid(false);
    
        System.out.println("hier ist alles noch okay");
        System.out.println(order.toString());
        Long orderId;

        try {
            em.persist(order);
            user.setOrder(order);
            em.merge(user);
            em.flush();
            orderId = order.getId();

        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Error persisting order: " + e.getMessage()).build();
        }

        Map<Product, Long> productCountMap = new HashMap<>();
        Long cntOrderItems = 0L;

        orderItemOrm.internal_addOrderItem(orderId, orderItems);

        for (OrderItem orderItem : orderItems) {
            cntOrderItems++;
            Product product = orderItem.getProduct();
            // addProductToOrder(orderId, orderItem.getProduct().getId());
            productCountMap.merge(product, 1L, Long::sum);
        }

        // Update stock of products
        try {
            for (Map.Entry<Product, Long> entry : productCountMap.entrySet()) {
                Product product = entry.getKey();
    
                Product dbProduct = em.find(Product.class, product.getId());
                if (dbProduct == null) {
                    return Response.status(Response.Status.BAD_REQUEST).entity("Product with ID " + product.getId() + " not found").build();
                }

                if (dbProduct.getStock().equals(dbProduct.getConsumption())) {
                    return Response.status(Response.Status.CONFLICT).entity("Kein Bestand mehr für dieses Produkt").build();
                }
    
                try {
                    em.merge(dbProduct);
                    
                } catch (Exception e) {
                    return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("cant merge").build();
                    
                }
            }
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Error updating product stock: " + e.getMessage()).build();
        }
    
        return Response.status(Response.Status.CREATED).entity("New order created with " + cntOrderItems + " products").build();
    }

    @Transactional
    public Response updateOrder(Long userId, List<OrderItem> newOrderItems) {
        System.out.println("updateOrder");

        //Fetch open order for user from DB
        Order dbOrder = getOpenOrderByUser(userId);
        //Check if order exists
        if (dbOrder == null) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity("Order not found").build();
        }

        List<OrderItem> existingOrderItems = dbOrder.getOrderItems();

        List<OrderItem> newItems = newOrderItems.stream()
        .filter(newItem -> existingOrderItems.stream()
            .noneMatch(existingItem -> existingItem.getId() == newItem.getId()))
        .collect(Collectors.toList());

        // Find deleted items (in existingOrderItems but not in newOrderItems)
        List<OrderItem> deletedItems = existingOrderItems.stream()
            .filter(existingItem -> newOrderItems.stream()
                .noneMatch(newItem -> newItem.getId() == existingItem.getId()))
            .collect(Collectors.toList());

        // for (OrderItem newItem : newItems) {
        //     addProductToOrder(dbOrder.getId(), newItem.getProduct().getId());
        // }
        orderItemOrm.internal_addOrderItem(dbOrder.getId(),newItems);

        for(OrderItem deletedItem: deletedItems)
        {   
            dbOrder.removeOrderItem(deletedItem);
        }

        return Response.status(200).entity("Bestellung aktualisiert").build();
    }

    @Transactional
    public Response addProductToOrder(Long orderId, Long productId) {

        System.out.println("addProductToOrder");

        Order orderDB = new Order();
        Product productDB = new Product();

        try {
            orderDB = em.find(Order.class, orderId);
        } catch (Exception e) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity("Could not find order").build();
        }

        if (orderDB == null) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity("Order not found").build();
        }

        try {
            productDB = em.find(Product.class, productId);
        } catch (Exception e) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity("did not find product").build();
        }

        if (productDB == null) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity("Product not found").build();
        }

        if (productDB.getStock().equals(productDB.getConsumption())) {
            return Response.status(Response.Status.CONFLICT).entity("Kein Bestand mehr für dieses Produkt").build();
        }

        OrderItem orderItem = new OrderItem(productDB, orderDB, OrderItem.PaymentStatus.UNPAID, OrderItem.OrderStatus.ORDERED);

        try {
            em.persist(orderItem);
        } catch (Exception e) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity("faild to persist").build();
        }

        orderDB.addOrderItem(orderItem);
        orderDB.setOrderCompleted(false);
        orderDB.setOrderPaid(false);
        orderDB.setOrderDelivered(false);

        try {
            em.merge(orderDB);
        } catch (Exception e) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity("failed to merge order").build();
        }

        return Response.status(Response.Status.CREATED).entity("Product added to order").build();
    }

    @Transactional
    public Response removeProductFromOrder(Long orderId, Long productId)
    {
        System.out.println("removeProductFromOrder");

        Order orderDB = new Order();
        try {
            orderDB = em.find(Order.class, orderId);
        } catch (Exception e) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity(e).build();
        }

        if (orderDB == null) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity("Order not found").build();
        }

        List<OrderItem> orderItems = orderDB.getOrderItems();

        // Sort the order items
        orderItems.sort(Comparator
        .comparing((OrderItem item) -> item.getPaymentStatus() == PaymentStatus.PAID)
        .thenComparing(item -> item.getOrderStatus() == OrderStatus.DELIVERED));
        boolean itemFound = false;

        // only remove the first item found
        for (OrderItem orderItem : orderItems) {
            if (orderItem.getProduct().getId() == productId) {
                orderDB.removeOrderItem(orderItem);
                itemFound = true;
                break;
            }
        }

        if (!itemFound) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity("Item not found").build();
        }

        orderDB = checkIfOderIsCompled(orderDB);

        try {
            em.merge(orderDB);
        } catch (Exception e) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity(e).build();
        }

        return Response.status(Response.Status.OK).entity("Product removed from order").build();
    }

    @Transactional
    public Response updateOrderPayment(Long orderId, Long orderItemId) {

        Order orderDB = new Order();
        try {
            orderDB = em.find(Order.class, orderId);
        } catch (Exception e) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity(e).build();
        }

        if (orderDB == null) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity("Order not found").build();
        }

        OrderItem orderItem = new OrderItem();
        try {
            orderItem = em.find(OrderItem.class, orderItemId);
        } catch (Exception e) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity(e).build();
        }

        if (orderItem == null) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity("Order item not found").build();
        }

        if (orderItem.getPaymentStatus() == PaymentStatus.PAID) {
            orderDB.setOrderItemPay(orderItem, PaymentStatus.UNPAID);
        } else {
            orderDB.setOrderItemPay(orderItem, PaymentStatus.PAID);

            if(orderDB.getSum() == 0)
            {
                orderDB.setOrderPaid(true);
                if(Boolean.TRUE.equals( orderDB.isOrderDelivered()))
                {
                    orderDB.setOrderCompleted(true);
                }
            }
        }

        try {
            em.merge(orderItem);
        } catch (Exception e) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity(e).build();
        }

        return Response.status(Response.Status.CREATED).entity("Order updated").build();
    }

    @Transactional
    public Response payOrder(Long orderId) {
        Order orderDB = new Order();
        try {
            orderDB = em.find(Order.class, orderId);
        } catch (Exception e) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity(e).build();
        }

        if (orderDB == null) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity("Order not found").build();
        }

        if(orderDB.isOrderPaid())
        {
            return Response.status(Response.Status.CONFLICT).entity("Bestellung ist bereits als Bezahlt markiert").build();
        }

        orderDB.payOrder();

        try {
            em.merge(orderDB);
        } catch (Exception e) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity(e).build();
        }

        return Response.status(Response.Status.CREATED).entity("Order paid").build();
    }

    @Transactional
    public Response completeOrder(Long orderId) {
        Order orderDB = new Order();
        try {
            orderDB = em.find(Order.class, orderId);
        } catch (Exception e) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity(e).build();
        }

        if (orderDB == null) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity("Order not found").build();
        }

        orderDB.completeOrder();

        try {
            em.merge(orderDB);
        } catch (Exception e) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity(e).build();
        }

        return Response.status(Response.Status.CREATED).entity("Order completed").build();
    }

    @Transactional
    public Response deleteOrder(Order order) {

        Order orderDB = new Order();
        try {
            orderDB = em.find(Order.class, order.getId());
        }
        catch (Exception e) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity("Bestellung nicht gefunden").build();
        }

        if (orderDB == null) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity("Bestellung nicht gefunden").build();
        }

        List<OrderItem> orderItems = orderDB.getOrderItems();

        // only remove the first item found
        for (OrderItem orderItem : orderItems) {
            orderItem.getProduct().decConsumption();
        }

        try {
            em.remove(orderDB);

        } catch (Exception e) {
            return Response.status(Response.Status.EXPECTATION_FAILED).entity(e).build();
        }
        return Response.status(Response.Status.OK).entity("Bestellung gelöscht").build();
    }

    public Order checkIfOderIsCompled(Order order)
    {
        boolean isDelivered = true;
        boolean isPaid = true;
    
        if(order.isOrderDelivered() || order.isOrderPaid())
        {
            for (OrderItem orderItem : order.getOrderItems()) {
                if (orderItem.getOrderStatus() != OrderStatus.DELIVERED) {
                    isDelivered = false;
                }
                if (orderItem.getPaymentStatus() != PaymentStatus.PAID) {
                    isPaid = false;
                }
                if (!isDelivered && !isPaid) {
                    break;
                }
            }
        }
    
        order.setOrderDelivered(isDelivered);
        order.setOrderPaid(isPaid);
        order.setOrderCompleted(isDelivered && isPaid);
    
        return order;
    }

}
