package com.blinkstore.ai.service;

import com.blinkstore.ai.model.Order;
import com.blinkstore.ai.model.Product;
import com.blinkstore.ai.repository.OrderRepository;
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
public class AdminService {

    @Autowired private ProductRepository productRepository;
    @Autowired private OrderRepository orderRepository;
    
    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final Gson gson = new Gson();

    // Product methods
    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    public void deleteProduct(String id) {
        productRepository.deleteById(id);
    }

    // Order methods
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order updateOrderStatus(String orderId, String status) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        return orderRepository.save(order);
    }

    // AI Analytics method
    public String getAnalytics(String query) {
        String dataContext = "";
        if (query.toLowerCase().contains("sales") || query.toLowerCase().contains("revenue") || query.toLowerCase().contains("sell")) {
            List<Order> orders = orderRepository.findAll();
            dataContext = "Here is the raw sales order data in JSON format: " + gson.toJson(orders);
        } else if (query.toLowerCase().contains("stock") || query.toLowerCase().contains("inventory")) {
            List<Product> products = productRepository.findAll();
            dataContext = "Here is the raw product inventory data in JSON format: " + gson.toJson(products);
        }

        String prompt = "You are a senior business analyst for BlinkStore.AI. Your name is Jarvis. " +
                "You are provided with raw data from the store's database. Your task is to analyze this data to answer the user's question. " +
                "Provide a concise, data-driven, and professional answer. Start your response with 'Certainly. Here are the insights:'\n\n" +
                "DATA CONTEXT:\n" + dataContext + "\n\n" +
                "USER'S QUESTION:\n" + query;

        try {
            String apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=" + geminiApiKey;
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            String requestBody = "{\"contents\":[{\"role\":\"user\",\"parts\":[{\"text\":\"" + prompt.replace("\"", "\\\"") + "\"}]}]}";
            HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, entity, String.class);
            
            Map<String, Object> responseBody = gson.fromJson(response.getBody(), Map.class);
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseBody.get("candidates");
            if (candidates == null || candidates.isEmpty()) {
                return "Error: No candidates in AI response.";
            }
            Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
            if (content == null) {
                return "Error: No content in AI candidate.";
            }
            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
            if (parts == null || parts.isEmpty()) {
                return "Error: No parts in AI content.";
            }
            return (String) parts.get(0).get("text");

        } catch (Exception e) {
            System.err.println("Error during AI analytics call: " + e.getMessage());
            return "I apologize, but I encountered an error while analyzing the data. Please try rephrasing your question.";
        }
    }
}