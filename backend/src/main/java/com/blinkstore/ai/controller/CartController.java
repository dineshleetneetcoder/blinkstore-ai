package com.blinkstore.ai.controller;

import com.blinkstore.ai.dto.AddToCartRequest;
import com.blinkstore.ai.model.Cart;
import com.blinkstore.ai.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @PostMapping("/add")
    public ResponseEntity<Cart> addToCart(@AuthenticationPrincipal Jwt principal, @RequestBody AddToCartRequest request) {
        Cart updatedCart = cartService.addToCart(principal, request);
        return ResponseEntity.ok(updatedCart);
    }

    @GetMapping
    public ResponseEntity<Cart> getCart(@AuthenticationPrincipal Jwt principal) {
        return cartService.getCart(principal)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
