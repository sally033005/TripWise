package com.project.tripwise.service;

import com.project.tripwise.dto.LoginRequest;
import com.project.tripwise.dto.RegisterRequest;
import com.project.tripwise.model.User;
import com.project.tripwise.repository.UserRepository;
import com.project.tripwise.security.JwtUtils;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;

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
    public User login(LoginRequest request, HttpServletResponse response) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        // a. Generate JWT Token
        String token = jwtUtils.generateToken(user.getUsername());

        // b. Create a secure, HttpOnly cookie to store the JWT token
        Cookie cookie = new Cookie("token", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // Set to true in production with HTTPS, false for local development
        cookie.setPath("/"); // Cookie is valid for the entire application
        cookie.setMaxAge(86400);

        // c. Add the cookie to the response
        response.addCookie(cookie);

        return user;
    }

    // 3. User Logout
    public void logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("token", null);

        cookie.setHttpOnly(true);
        cookie.setSecure(false); // Set to true in production with HTTPS, false for local development
        cookie.setPath("/");

        cookie.setMaxAge(0);

        response.addCookie(cookie);
    }

}