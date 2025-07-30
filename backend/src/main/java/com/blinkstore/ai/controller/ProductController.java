package com.blinkstore.ai.controller;

import com.blinkstore.ai.model.Product;
import com.blinkstore.ai.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/v1/products") // All endpoints in this file will start with this path
public class ProductController {

    private final ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping // This method handles HTTP GET requests
    public List<Product> getAllProducts() {
        // When someone visits http://localhost:8080/api/v1/products, this code runs.
        return productService.getAllProducts();
    }
}
