package com.blinkstore.ai.controller;

import com.blinkstore.ai.model.Product;
import com.blinkstore.ai.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/products")
public class ProductController {

    private final ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // This endpoint now correctly uses the @RequestParam to filter.
    // Example URL: /api/v1/products?category=Fruits%20&%20Vegetables
    @GetMapping
    public List<Product> getProducts(@RequestParam Optional<String> category) {
        return productService.getProducts(category);
    }
}
