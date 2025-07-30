package com.blinkstore.ai.repository;

import com.blinkstore.ai.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {
    // You can add custom query methods here later if needed, e.g., findByCategory(String category)
}

