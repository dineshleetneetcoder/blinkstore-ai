package com.blinkstore.ai.dto;

import lombok.Data;

@Data
public class UpdateCartRequest {
    private String productId;
    private int quantity;
}
