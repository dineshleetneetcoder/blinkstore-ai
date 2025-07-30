package com.blinkstore.ai.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(authorize -> authorize
                // Allow anyone to view products
                .requestMatchers(HttpMethod.GET, "/api/v1/products").permitAll()
                // Any other request must be authenticated
                .anyRequest().authenticated()
            )
            // Use JWTs for authentication
            .oauth2ResourceServer(oauth2 -> oauth2.jwt());
        
        // Add the existing CORS configuration
        http.cors();

        return http.build();
    }
}

