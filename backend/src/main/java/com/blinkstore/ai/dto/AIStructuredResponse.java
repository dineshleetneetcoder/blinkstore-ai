package com.blinkstore.ai.dto;

import lombok.Data;
import java.util.List;

@Data
public class AIStructuredResponse {
    private String responseText;
    private List<ActionableProduct> actionableProducts;

    @Data
    public static class ActionableProduct {
        private String productId;
        private String name;
    }
}