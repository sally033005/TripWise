package com.project.tripwise.service;

import com.project.tripwise.dto.LoginRequest;
import com.project.tripwise.dto.RegisterRequest;
import com.project.tripwise.model.User;
import com.project.tripwise.repository.UserRepository;
import com.project.tripwise.security.JwtUtils;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import jakarta.servlet.http.HttpServletResponse;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder, JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    // 1. User Registration
    public User register(RegisterRequest request) {
        // a. Check if username already exists
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists!");
        }

        // b. Save the new user to the database
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        // c. Hash the password before saving
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        return userRepository.save(user);
    }

    // 2. User Login
    public String login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return jwtUtils.generateToken(user.getUsername());
    }

    // 3. User Logout
    public void logout(HttpServletResponse response) {
        // String cookieHeader = "token=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=None";
        // response.setHeader("Set-Cookie", cookieHeader);
    }

}