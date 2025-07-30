package com.blinkstore.ai.repository;

import com.blinkstore.ai.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {
    // This method name is crucial. Spring automatically creates a query
    // to find all products where the 'category' field matches the input string.
    List<Product> findByCategory(String category);
}