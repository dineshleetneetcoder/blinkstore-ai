package com.blinkstore.ai.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Document(collection = "orders")
public class Order {
    @Id
    private String id;
    private String userId;
    private List<CartItem> items;
    private BigDecimal totalAmount;
    private String status; // e.g., "Placed", "Packed", "Dispatched", "Delivered"
    private String deliveryAddress;
    private LocalDateTime createdAt;
}
