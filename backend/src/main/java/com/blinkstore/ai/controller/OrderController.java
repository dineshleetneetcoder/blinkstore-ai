package com.blinkstore.ai.controller;

import com.blinkstore.ai.dto.CheckoutRequest;
import com.blinkstore.ai.model.Order;
import com.blinkstore.ai.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    public ResponseEntity<Order> placeOrder(@AuthenticationPrincipal Jwt principal, @RequestBody CheckoutRequest request) {
        Order newOrder = orderService.placeOrder(principal, request);
        return ResponseEntity.ok(newOrder);
    }

    @GetMapping
    public ResponseEntity<List<Order>> getOrderHistory(@AuthenticationPrincipal Jwt principal) {
        List<Order> orders = orderService.getOrderHistory(principal);
        return ResponseEntity.ok(orders);
    }
}
