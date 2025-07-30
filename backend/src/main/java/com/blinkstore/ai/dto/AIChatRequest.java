package com.blinkstore.ai.dto;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class AIChatRequest {
    private List<Map<String, String>> history; // e.g., [{"sender": "user", "text": "Hello"}]
}