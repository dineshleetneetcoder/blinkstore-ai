package com.blinkstore.backend.repository;

import com.blinkstore.backend.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {
    // Spring Data will automatically implement methods like:
    // findAll(), findById(), save(), deleteById(), etc.
    // You can also add custom query methods here later, like:
    // List<Product> findByCategory(String category);
}