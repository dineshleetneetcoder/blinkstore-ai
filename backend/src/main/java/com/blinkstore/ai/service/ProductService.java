package com.blinkstore.ai.service;

import com.blinkstore.ai.model.Product;
import com.blinkstore.ai.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    @Autowired
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // The logic to check for the category parameter and call the correct repository method.
    public List<Product> getProducts(Optional<String> category) {
        // If a category is present and not empty, filter by it.
        if (category.isPresent() && !category.get().isBlank()) {
            return productRepository.findByCategory(category.get());
        }
        // Otherwise, return all products.
        return productRepository.findAll();
    }
}