package com.blinkstore.ai.service;

import com.blinkstore.ai.dto.AddToCartRequest;
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

    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private UserService userService;

    public Cart addToCart(Jwt principal, AddToCartRequest request) {
        // Find the user, or create them if it's their first time.
        User user = userService.findOrCreateUser(principal);

        // Find the product to be added
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Get the user's cart, or create a new one if it doesn't exist
        Cart cart = cartRepository.findByUserId(user.getId()).orElseGet(() -> {
            Cart newCart = new Cart();
            newCart.setUserId(user.getId());
            return newCart;
        });

        // Check if the item is already in the cart
        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProductId().equals(request.getProductId()))
                .findFirst();

        if (existingItem.isPresent()) {
            // If item exists, just update the quantity
            existingItem.get().setQuantity(existingItem.get().getQuantity() + request.getQuantity());
        } else {
            // If it's a new item, add it to the list
            CartItem newItem = new CartItem(
                    product.getId(),
                    product.getName(),
                    request.getQuantity(),
                    product.getPrice().doubleValue()
            );
            cart.getItems().add(newItem);
        }

        // Save the updated cart to the database
        return cartRepository.save(cart);
    }

    public Optional<Cart> getCart(Jwt principal) {
        User user = userService.findOrCreateUser(principal);
        return cartRepository.findByUserId(user.getId());
    }
}