package com.project.tripwise.service;

import com.project.tripwise.model.Trip;
import com.project.tripwise.model.User;
import com.project.tripwise.repository.TripRepository;
import com.project.tripwise.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class TripService {

    private final TripRepository tripRepository;
    private final UserRepository userRepository;

    public TripService(TripRepository tripRepository, UserRepository userRepository) {
        this.tripRepository = tripRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<Trip> getAllTripsForUser() {
        User user = getCurrentUser();
        return tripRepository.findByCreatorId(user.getId());
    }

    public Optional<Trip> getTripById(Long id) {
        return tripRepository.findById(id);
    }

    public Trip createTrip(Trip trip) {
        User user = getCurrentUser();
        trip.setCreator(user); 
        return tripRepository.save(trip);
    }
}