package com.blinkstore.ai.service;

import com.blinkstore.ai.dto.AddToCartRequest;
import com.blinkstore.ai.dto.UpdateCartRequest;
import com.blinkstore.ai.model.Cart;
import com.blinkstore.ai.model.CartItem;
import com.blinkstore.ai.model.Product;
import com.blinkstore.ai.model.User;
import com.blinkstore.ai.repository.CartRepository;
import com.blinkstore.ai.repository.ProductRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CartService {

    @Autowired private CartRepository cartRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private UserService userService;

    public Cart addToCart(Jwt principal, AddToCartRequest request) {
        User user = userService.findOrCreateUser(principal);

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Cart cart = cartRepository.findByUserId(user.getId()).orElseGet(() -> {
            Cart newCart = new Cart();
            newCart.setUserId(user.getId());
            return newCart;
        });

        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProductId().equals(request.getProductId()))
                .findFirst();

        if (existingItem.isPresent()) {
            existingItem.get().setQuantity(existingItem.get().getQuantity() + request.getQuantity());
        } else {
            CartItem newItem = new CartItem(
                    product.getId(),
                    product.getName(),
                    request.getQuantity(),
                    product.getPrice().doubleValue()
            );
            cart.getItems().add(newItem);
        }

        return cartRepository.save(cart);
    }

    public Optional<Cart> getCart(Jwt principal) {
        User user = userService.findOrCreateUser(principal);
        return cartRepository.findByUserId(user.getId());
    }

    public void clearCart(Jwt principal) {
        User user = userService.findOrCreateUser(principal);
        cartRepository.findByUserId(user.getId()).ifPresent(cart -> {
            cartRepository.delete(cart);
        });
    }

    public Cart updateItemQuantity(Jwt principal, UpdateCartRequest request) {
        User user = userService.findOrCreateUser(principal);
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        cart.getItems().stream()
                .filter(item -> item.getProductId().equals(request.getProductId()))
                .findFirst()
                .ifPresent(item -> item.setQuantity(request.getQuantity()));

        cart.getItems().removeIf(item -> item.getQuantity() <= 0);

        return cartRepository.save(cart);
    }

    public Cart removeItemFromCart(Jwt principal, String productId) {
        User user = userService.findOrCreateUser(principal);
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        cart.getItems().removeIf(item -> item.getProductId().equals(productId));

        return cartRepository.save(cart);
    }
}
