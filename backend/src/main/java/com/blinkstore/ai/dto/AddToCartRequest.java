package com.blinkstore.ai.dto;

import lombok.Data;

@Data
public class AddToCartRequest {
    private String productId;
    private int quantity;
}