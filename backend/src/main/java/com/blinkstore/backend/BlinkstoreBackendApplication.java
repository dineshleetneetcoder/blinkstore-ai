package com.blinkstore.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BlinkstoreBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BlinkstoreBackendApplication.class, args);
        System.out.println("\n✅ BlinkStore.AI Backend is running!");
        System.out.println("🔗 API available at http://localhost:8080/api/products\n");
    }
}