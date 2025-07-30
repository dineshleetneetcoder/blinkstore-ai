package com.blinkstore.ai.service;

import com.blinkstore.ai.dto.AIChatRequest;
import com.blinkstore.ai.dto.AIStructuredResponse;
import com.blinkstore.ai.model.Product;
import com.blinkstore.ai.repository.ProductRepository;
import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AIService {

    @Autowired
    private ProductRepository productRepository;

    // You will need to add your Gemini API Key to application.properties
    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final Gson gson = new Gson();

    public AIStructuredResponse getAIResponse(AIChatRequest chatRequest) {
        // 1. Fetch all products from our database
        List<Product> allProducts = productRepository.findAll();
        String productCatalog = allProducts.stream()
                .map(p -> p.getName() + " (ID: " + p.getId() + ")")
                .collect(Collectors.joining(", "));

        // 2. Build the detailed prompt for the AI
        String prompt = buildPrompt(chatRequest.getHistory(), productCatalog);

        // 3. Call the Gemini API
        try {
            String apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=" + geminiApiKey;
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            String requestBody = "{\"contents\":[{\"role\":\"user\",\"parts\":[{\"text\":\"" + prompt.replace("\"", "\\\"") + "\"}]}]}";
            
            HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, entity, String.class);

            // 4. Parse the AI's response
            Map<String, Object> responseBody = gson.fromJson(response.getBody(), Map.class);
            List<Map> candidates = (List<Map>) responseBody.get("candidates");
            Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
            List<Map> parts = (List<Map>) content.get("parts");
            String rawText = (String) parts.get(0).get("text");

            // Clean the response and convert it to our structured object
            String cleanedJson = rawText.replace("```json", "").replace("```", "").trim();
            return gson.fromJson(cleanedJson, AIStructuredResponse.class);

        } catch (Exception e) {
            System.err.println("Error calling Gemini API: " + e.getMessage());
            AIStructuredResponse errorResponse = new AIStructuredResponse();
            errorResponse.setResponseText("Sorry, I'm having trouble connecting to my brain right now. Please try again later.");
            return errorResponse;
        }
    }

    private String buildPrompt(List<Map<String, String>> history, String productCatalog) {
        StringBuilder historyString = new StringBuilder();
        for (Map<String, String> message : history) {
            historyString.append(message.get("sender")).append(": ").append(message.get("text")).append("\n");
        }

        return "You are BlinkStore.AI, a helpful and friendly grocery assistant for an online store. Your personality is witty and concise." +
                "The user's recent chat history is:\n" + historyString.toString() + "\n" +
                "Our store has the following products available (name and ID): " + productCatalog + "\n\n" +
                "Your task is to analyze the user's latest message from the history and perform ONE of the following actions:\n" +
                "1. If the user asks for a recipe (e.g., 'bread pakoda', 'poha'), first determine the necessary ingredients. Then, compare that list against our available products. You must be smart about matching (e.g., 'onion' or 'pyaz' matches 'Fresh Onion'). Formulate a response that tells the user which ingredients we have and which we don't. If there are available ingredients, ask for confirmation to add them to the cart.\n" +
                "2. If the user asks a general question about our products (e.g., 'do you have milk?', 'what kind of snacks do you have?'), answer based ONLY on the provided product catalog.\n" +
                "3. For any other conversational message, provide a brief, helpful response in character.\n\n" +
                "YOU MUST RESPOND IN THE FOLLOWING JSON FORMAT ONLY. DO NOT ADD ANY OTHER TEXT BEFORE OR AFTER THE JSON:\n" +
                "{\n" +
                "  \"responseText\": \"Your conversational reply to the user.\",\n" +
                "  \"actionableProducts\": [\n" +
                "    { \"productId\": \"The exact ID from the catalog\", \"name\": \"The exact name from the catalog\" } \n" +
                "  ]\n" +
                "}\n" +
                "If there are no products to add to the cart for this response, the 'actionableProducts' array MUST be empty.";
    }
}