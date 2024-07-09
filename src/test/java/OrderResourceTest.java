import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;
import model.Order;
import model.OrderItem;
import model.User;

import org.junit.jupiter.api.Test;
import resources.OrderResource;
import orm.OrderOrm;
import orm.UserOrm;

import java.util.ArrayList;
import java.util.List;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.is;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

@QuarkusTest
public class OrderResourceTest {

    @Inject
    OrderOrm orderOrm;

    @Inject
    UserOrm userOrm;

    @Inject
    OrderResource orderResource;

    // @Test
    // public void testGetOrderById() {
    //     Order mockOrder = new Order();
    //     mockOrder.setId(1L);
    //     List<Order> mockOrders = new ArrayList<>();
    //     mockOrders.add(mockOrder);

    //     when(orderOrm.getOrderById(1L)).thenReturn(Response.ok(mockOrders).build());

    //     given()
    //         .when().get("/api/order?orderId=1")
    //         .then()
    //         .statusCode(200)
    //         .body("size()", is(1));
    // }

    // @Test
    // public void testUpdateOrderItems()
    // {
    //     Response response;
    //     User mockUser = new User();
    //     mockUser.setId(10L);
    //     response = userOrm.addUser(mockUser); 
    //     assert response.getStatus() == Response.Status.CREATED.getStatusCode();
    //     assert response.getEntity().toString().contains("Nutzer erfolgreich erstellt");

    //     Order mockOrder = new Order();
    //     mockOrder.setUser(mockUser);

        

    //     orderOrm.createOrder(mockUser.getId(), null);


    //     //Cleanup
    //     response = userOrm.delteUser(mockUser);
    //     assert response.getStatus() == Response.Status.ACCEPTED.getStatusCode();
    //     assert response.getEntity().toString().contains("Benutzer erfolgreich gelöscht");


    // }

    // @Test
    // public void testCreateOrder() {
    //     List<OrderItem> orderItems = new ArrayList<>();
    //     when(orderOrm.createOrder(anyLong(), anyList())).thenReturn(Response.status(Response.Status.CREATED).entity("New order created").build());

    //     Response response = orderResource.createOrder(1L, orderItems);
        
    //     assert response.getStatus() == Response.Status.CREATED.getStatusCode();
    //     assert response.getEntity().toString().contains("New order created");
    // }

    // @Test
    // public void testSecondOrderForSameUser() {
    //     List<OrderItem> orderItems = new ArrayList<>();
    //     when(orderOrm.createOrder(anyLong(), anyList())).thenReturn(Response.status(Response.Status.CREATED).entity("New order created").build());

    //     Response response = orderResource.createOrder(1L, orderItems);
        
    //     assert response.getStatus() == Response.Status.CREATED.getStatusCode();
    //     assert response.getEntity().toString().contains("Der Benutzer hat schon eine Bestellung. Aktualisiere diese Bestellung");
    // }

    // @Test
    // public void testUserNotFound() {
    //     List<OrderItem> orderItems = new ArrayList<>();
    //     when(orderOrm.createOrder(anyLong(), anyList())).thenReturn(Response.status(Response.Status.CREATED).entity("New order created").build());

    //     Response response = orderResource.createOrder(1L, orderItems);
        
    //     assert response.getStatus() == Response.Status.CREATED.getStatusCode();
    //     assert response.getEntity().toString().contains("Benutzer nicht gefunden");
    // }

    // @Test
    // public void testOderNotFound() {
    //     List<OrderItem> orderItems = new ArrayList<>();
    //     when(orderOrm.createOrder(anyLong(), anyList())).thenReturn(Response.status(Response.Status.CREATED).entity("New order created").build());

    //     Response response = orderResource.createOrder(1L, orderItems);
        
    //     assert response.getStatus() == Response.Status.CREATED.getStatusCode();
    //     assert response.getEntity().toString().contains("Der Benutzer hat schon eine Bestellung. Aktualisiere diese Bestellung");
    // }

    // @Test
    // public void testUpdateOrder() {
    //     when(orderOrm.updateOrder(eq(1L), anyList())).thenReturn(Response.ok("Order updated").build());

    //     Response response = orderResource.updateOrder(1L, null, null, null, null, 1L, new ArrayList<>());
        
    //     assert response.getStatus() == Response.Status.OK.getStatusCode();
    //     assert response.getEntity().toString().contains("Order updated");
    // }

    // @Test
    // public void testDeleteOrder() {
    //     Order mockOrder = new Order();
    //     when(orderOrm.deleteOrder(any(Order.class))).thenReturn(Response.ok("Order deleted").build());

    //     Response response = orderResource.deleteOrder(mockOrder);
        
    //     assert response.getStatus() == Response.Status.OK.getStatusCode();
    //     assert response.getEntity().toString().contains("Order deleted");
    // }
}