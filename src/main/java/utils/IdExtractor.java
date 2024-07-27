package utils;
import java.util.List;
import java.util.stream.Collectors;

public class IdExtractor {

    /**
     * Extracts IDs from a list of objects that have an getId() method.
     * 
     * @param <T> The type of objects in the list. T must have a getId() method that returns a type K.
     * @param <K> The type of the ID (usually Long, Integer, or String).
     * @param objects The list of objects to extract IDs from.
     * @return A list of IDs extracted from the input objects.
     */
    public static <T, K> List<K> extractIds(List<T> objects) {
        return objects.stream()
                      .map(obj -> {
                          try {
                              return (K) obj.getClass().getMethod("getId").invoke(obj);
                          } catch (Exception e) {
                              throw new RuntimeException("Error extracting ID from object", e);
                          }
                      })
                      .collect(Collectors.toList());
    }
}
