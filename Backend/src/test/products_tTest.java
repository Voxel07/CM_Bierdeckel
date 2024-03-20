package test;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

import io.quarkus.test.common.QuarkusTestResource;

@QuarkusTest
public class products_t {

    @Test
    public void testAddProduct() {
        // Arrange
        Product product = new Product("Test Product", 10.0);

        // Act
        // Add code here to add the product
        given().contentType(MediaType.APPLICATION_JSON).body(product).when().put("/products").then().statusCode(200)
				.body(is("Product created"));

		Response response = given().contentType(MediaType.APPLICATION_JSON).when().get("/products");

		response.then().statusCode(200);

        // Assert
        // Add code here to assert that the product was added successfully
    }

    @Test
    public void testUpdateProduct() {
        // Arrange
        Product product = new Product("Test Product", 10.0);

        // Act
        // Add code here to update the product

        // Assert
        // Add code here to assert that the product was updated successfully
    }

    @Test
    public void testDeleteProduct() {
        // Arrange
        Product product = new Product("Test Product", 10.0);

        // Act
        // Add code here to delete the product

        // Assert
        // Add code here to assert that the product was deleted successfully
    }
}