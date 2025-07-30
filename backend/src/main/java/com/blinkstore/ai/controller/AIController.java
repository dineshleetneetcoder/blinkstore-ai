package com.blinkstore.ai.controller;

import com.blinkstore.ai.dto.AIChatRequest;
import com.blinkstore.ai.dto.AIStructuredResponse;
import com.blinkstore.ai.service.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/ai")
public class AIController {

    @Autowired
    private AIService aiService;

    @PostMapping("/chat")
    public ResponseEntity<AIStructuredResponse> handleChat(@RequestBody AIChatRequest chatRequest) {
        AIStructuredResponse response = aiService.getAIResponse(chatRequest);
        return ResponseEntity.ok(response);
    }
}
