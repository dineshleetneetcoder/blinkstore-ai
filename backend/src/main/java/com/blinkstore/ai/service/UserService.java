package com.blinkstore.ai.service;

import com.blinkstore.ai.model.User;
import com.blinkstore.ai.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User findOrCreateUser(Jwt principal) {
        String clerkId = principal.getSubject();
        
        return userRepository.findByClerkId(clerkId).orElseGet(() -> {
            User newUser = new User();
            newUser.setClerkId(clerkId);
            newUser.setEmail(principal.getClaimAsString("email"));
            // Try to get name from Clerk claims
            String name = principal.getClaimAsString("name");
            if (name == null || name.isBlank()) {
                name = principal.getClaimAsString("first_name") + " " + principal.getClaimAsString("last_name");
            }
            newUser.setName(name);
            return userRepository.save(newUser);
        });
    }
}