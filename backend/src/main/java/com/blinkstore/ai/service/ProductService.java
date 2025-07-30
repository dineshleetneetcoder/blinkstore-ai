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

    // This method now accepts both a category and a search term.
    public List<Product> getProducts(Optional<String> category, Optional<String> search) {
        // If a search term is provided, use it to search by name.
        if (search.isPresent() && !search.get().isBlank()) {
            return productRepository.findByNameContainingIgnoreCase(search.get());
        }
        // If no search term, but a category is provided, filter by category.
        if (category.isPresent() && !category.get().isBlank()) {
            return productRepository.findByCategory(category.get());
        }
        // If neither is provided, return all products.
        return productRepository.findAll();
    }
}