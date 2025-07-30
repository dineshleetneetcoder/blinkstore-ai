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

    // The endpoint now accepts both 'category' and 'search' parameters.
    // The service layer will decide which one to use.
    @GetMapping
    public List<Product> getProducts(
            @RequestParam Optional<String> category,
            @RequestParam Optional<String> search) {
        return productService.getProducts(category, search);
    }
}