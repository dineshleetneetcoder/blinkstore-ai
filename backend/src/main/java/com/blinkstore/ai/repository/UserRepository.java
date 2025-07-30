package com.blinkstore.ai.repository;

import com.blinkstore.ai.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByClerkId(String clerkId);
}
