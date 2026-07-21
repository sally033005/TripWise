package com.project.tripwise.service;

import com.project.tripwise.dto.LoginRequest;
import com.project.tripwise.dto.RegisterRequest;
import com.project.tripwise.model.User;
import com.project.tripwise.repository.UserRepository;
import com.project.tripwise.security.JwtUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private BCryptPasswordEncoder passwordEncoder;

    @Mock
    private JwtUtils jwtUtils;

    @InjectMocks
    private AuthService authService;

    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;

    @BeforeEach
    void setUp() {
        registerRequest = new RegisterRequest();
        registerRequest.setUsername("alice");
        registerRequest.setEmail("alice@example.com");
        registerRequest.setPassword("password123");

        loginRequest = new LoginRequest();
        loginRequest.setUsername("alice");
        loginRequest.setPassword("password123");
    }

    @Test
    void register_savesNewUserWithHashedPassword() {
        when(userRepository.findByUsername("alice")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("password123")).thenReturn("hashed-password");

        User savedUser = new User();
        savedUser.setId(1L);
        savedUser.setUsername("alice");
        savedUser.setEmail("alice@example.com");
        savedUser.setPassword("hashed-password");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        User result = authService.register(registerRequest);

        assertEquals("alice", result.getUsername());
        assertEquals("alice@example.com", result.getEmail());

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        assertEquals("hashed-password", userCaptor.getValue().getPassword());
    }

    @Test
    void register_throwsWhenUsernameAlreadyExists() {
        when(userRepository.findByUsername("alice")).thenReturn(Optional.of(new User()));

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> authService.register(registerRequest));

        assertEquals("Username already exists!", exception.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void login_returnsJwtWhenCredentialsAreValid() {
        User user = new User();
        user.setUsername("alice");
        user.setPassword("hashed-password");

        when(userRepository.findByUsername("alice")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password123", "hashed-password")).thenReturn(true);
        when(jwtUtils.generateToken("alice")).thenReturn("jwt-token");

        String token = authService.login(loginRequest);

        assertEquals("jwt-token", token);
    }

    @Test
    void login_throwsWhenUserNotFound() {
        when(userRepository.findByUsername("alice")).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> authService.login(loginRequest));

        assertEquals("User not found", exception.getMessage());
    }

    @Test
    void login_throwsWhenPasswordIsInvalid() {
        User user = new User();
        user.setUsername("alice");
        user.setPassword("hashed-password");

        when(userRepository.findByUsername("alice")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password123", "hashed-password")).thenReturn(false);

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> authService.login(loginRequest));

        assertEquals("Invalid password", exception.getMessage());
    }
}
