package com.blinkstore.ai.service;

import com.blinkstore.ai.dto.CheckoutRequest;
import com.blinkstore.ai.model.Cart;
import com.blinkstore.ai.model.Order;
import com.blinkstore.ai.model.User;
import com.blinkstore.ai.repository.CartRepository;
import com.blinkstore.ai.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private UserService userService;

    public Order placeOrder(Jwt principal, CheckoutRequest request) {
        // 1. Find the user
        User user = userService.findOrCreateUser(principal);

        // 2. Find the user's cart
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Cart not found or is empty."));

        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new RuntimeException("Cannot place an order with an empty cart.");
        }

        // 3. Calculate the total amount
        BigDecimal total = cart.getItems().stream()
                .map(item -> BigDecimal.valueOf(item.getPrice()).multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 4. Create a new Order object
        Order order = new Order();
        order.setUserId(user.getId());
        order.setItems(cart.getItems());
        order.setTotalAmount(total);
        order.setDeliveryAddress(request.getDeliveryAddress());
        order.setStatus("Placed");
        order.setCreatedAt(LocalDateTime.now());

        // 5. Save the order to the database
        Order savedOrder = orderRepository.save(order);

        // 6. Clear the user's cart
        cartRepository.delete(cart);

        return savedOrder;
    }

    public List<Order> getOrderHistory(Jwt principal) {
        User user = userService.findOrCreateUser(principal);
        return orderRepository.findByUserId(user.getId());
    }
}
