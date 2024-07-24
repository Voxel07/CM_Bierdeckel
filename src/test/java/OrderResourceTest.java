import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.core.Response;
import model.Order;
import model.OrderItem;
import model.Product;
import model.User;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;

import resources.OrderResource;
import orm.OrderOrm;
import orm.UserOrm;

import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.Assertions;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.is;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

import io.quarkus.test.junit.TestProfile;

@QuarkusTest
@TestProfile(TestProfiles.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class OrderResourceTest {

    @Inject
    EntityManager em;

    @Inject
    TestProfiles.TestDatabaseCleaner databaseCleaner;

    @Inject
    UserOrm userOrm;

    @BeforeEach
    public void setup() {
        databaseCleaner.cleanDatabase();
    }

    @Test
    @Transactional
    public void test_addUser()
    {
        User user = new User("Max", "guest");
        given().headers("Content-Type", "application/json")
            .when().body(user).post("/api/users")
            .then().statusCode(201).body(is("Nutzer erfolgreich erstellt"));
    }

    @Test
    @Transactional
    public void test_addUserWithSameName()
    {
        User user = new User("Max", "guest");
        given().headers("Content-Type", "application/json")
            .when().body(user).post("/api/users")
            .then().statusCode(201).body(is("Nutzer erfolgreich erstellt"));
        
        given().headers("Content-Type", "application/json")
            .when().body(user).post("/api/users")
            .then().statusCode(403).body(is("Benutzer mit diesem Namen gibt es bereits"));
    }

    @Test
    @Transactional
    public void test_getUser()
    {
        User user = new User("Max", "guest");
        given().headers("Content-Type", "application/json")
            .when().body(user).post("/api/users")
            .then().statusCode(201).body(is("Nutzer erfolgreich erstellt"));

            given().headers("Content-Type", "application/json").param("username", user.getUsername())
                .when().body(user).get("/api/users")
                .then().statusCode(200)
                .body("size()", is(1))  // Ensure we're getting an array with one element
                .body("[0].username", is(user.getUsername()))
                .body("[0].role", is(user.getRole()));
    }

    @Test
    @Transactional
    public void test_updateUser()
    {
        User user = new User("Max", "guest");

        given().headers("Content-Type", "application/json")
            .when().body(user).post("/api/users")
            .then().statusCode(201).body(is("Nutzer erfolgreich erstellt"));

        user.setUsername("Peter");
        user.setRole("admin");

        given().headers("Content-Type", "application/json")
            .when().body(user).put("/api/users")
            .then().statusCode(200).body(is("User erfolgreich aktualisiert"));

        given().headers("Content-Type", "application/json").param("username", user.getUsername())
            .when().get("/api/users")
            .then().statusCode(200)
            .body("size()", is(1))  // Ensure we're getting an array with one element
            .body("[0].username", is(user.getUsername()))
            .body("[0].role", is(user.getRole()));
    }

    @Test
    @Transactional
    public void test_deleteUser()
    {
        User user = new User("Max", "guest");
        User user2 = new User("Müller", "guest");

        given().headers("Content-Type", "application/json")
            .when().body(user).post("/api/users")
            .then().statusCode(201).body(is("Nutzer erfolgreich erstellt"));
        
        given().headers("Content-Type", "application/json")
            .when().body(user2).post("/api/users")
            .then().statusCode(201).body(is("Nutzer erfolgreich erstellt"));

        given().headers("Content-Type", "application/json")
            .when().get("/api/users")
            .then().statusCode(200)
            .body("size()", is(2));

        User dbUser = userOrm.getUserByUsername(user.getUsername());

        given().headers("Content-Type", "application/json")
            .when().body(dbUser).delete("/api/users")
            .then().statusCode(200);

        given().headers("Content-Type", "application/json").param("username", user.getUsername())
            .when().get("/api/users")
            .then().statusCode(200)
            .body("size()", is(1));
        
    }
}