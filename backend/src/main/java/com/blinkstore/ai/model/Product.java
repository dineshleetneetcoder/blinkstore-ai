package com.blinkstore.ai.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data // Lombok annotation to automatically create getters, setters, toString, etc.
@Document(collection = "products") // Maps this class to the "products" collection in MongoDB
public class Product {

    @Id
    private String id; // Unique identifier, MongoDB will generate this

    private String name;
    private String description;
    private String category;
    private BigDecimal price;
    private List<String> tags;
    private int stock;
    private String imageUrl;
}

