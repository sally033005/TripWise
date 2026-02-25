package com.project.tripwise.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.project.tripwise.model.User;
import com.project.tripwise.repository.UserRepository;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository) {
        return args -> {
            if (userRepository.count() == 0) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setEmail("admin@tripwise.com");
                admin.setPassword("password123");
                userRepository.save(admin);
                System.out.println("Admin user created: " + admin.getUsername());
            }
        };
    }
}
