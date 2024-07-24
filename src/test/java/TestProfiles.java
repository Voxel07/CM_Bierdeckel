import io.quarkus.test.junit.QuarkusTestProfile;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

import java.util.Map;

public class TestProfiles implements QuarkusTestProfile {
    @Override
    public Map<String, String> getConfigOverrides() {
        return Map.of(
            "quarkus.datasource.jdbc.url", "jdbc:mariadb://94.130.168.209:33/test_bierdeckel?serverTimezone=UTC"
        );
    }

    @Override
    public String getConfigProfile() {
        return "test";
    }

    @ApplicationScoped
    public static class TestDatabaseCleaner {
        @Inject
        EntityManager em;

        @Transactional
        public void cleanDatabase() {
            em.createNativeQuery("SET FOREIGN_KEY_CHECKS = 0").executeUpdate();
            em.createNativeQuery("TRUNCATE TABLE REQUESTS").executeUpdate();
            em.createNativeQuery("TRUNCATE TABLE EXTRAS").executeUpdate();
            em.createNativeQuery("TRUNCATE TABLE PRODUCTS").executeUpdate();
            em.createNativeQuery("TRUNCATE TABLE EXTRA_ITEMS").executeUpdate();
            em.createNativeQuery("TRUNCATE TABLE ORDER_ITEMS").executeUpdate();
            em.createNativeQuery("TRUNCATE TABLE USER").executeUpdate();
            em.createNativeQuery("SET FOREIGN_KEY_CHECKS = 1").executeUpdate();
        }
    }
}