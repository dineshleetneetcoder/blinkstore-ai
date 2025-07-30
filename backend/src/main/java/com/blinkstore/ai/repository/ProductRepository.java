package com.blinkstore.ai.repository;

import com.blinkstore.ai.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {
    // Finds products by category (case-sensitive).
    List<Product> findByCategory(String category);

    // **NEW**: Finds products where the name contains the search term, ignoring case.
    // e.g., searching for "milk" will find "Amul Gold Milk".
    List<Product> findByNameContainingIgnoreCase(String name);
}
