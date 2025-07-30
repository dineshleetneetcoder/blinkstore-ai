package com.blinkstore.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Data // Lombok annotation to auto-generate getters, setters, toString, etc.
@Document(collection = "products") // Maps this class to the "products" collection in MongoDB
public class Product {

    @Id
    private String id; // MongoDB will automatically generate this

    private String name;
    private String category;
    private double price;
    private int stock;
    private List<String> tags;
    private String imageUrl;
}