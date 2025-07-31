package com.blinkstore.ai.controller;

import com.blinkstore.ai.dto.AddToCartRequest;
import com.blinkstore.ai.dto.UpdateCartRequest;
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

    @Autowired private CartService cartService;

    @GetMapping
    public ResponseEntity<Cart> getCart(@AuthenticationPrincipal Jwt principal) {
        return cartService.getCart(principal).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/add")
    public ResponseEntity<Cart> addToCart(@AuthenticationPrincipal Jwt principal, @RequestBody AddToCartRequest request) {
        return ResponseEntity.ok(cartService.addToCart(principal, request));
    }

    @PutMapping("/item")
    public ResponseEntity<Cart> updateItemQuantity(@AuthenticationPrincipal Jwt principal, @RequestBody UpdateCartRequest request) {
        return ResponseEntity.ok(cartService.updateItemQuantity(principal, request));
    }

    @DeleteMapping("/item/{productId}")
    public ResponseEntity<Cart> removeItem(@AuthenticationPrincipal Jwt principal, @PathVariable String productId) {
        return ResponseEntity.ok(cartService.removeItemFromCart(principal, productId));
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(@AuthenticationPrincipal Jwt principal) {
        cartService.clearCart(principal);
        return ResponseEntity.ok().build();
    }
}