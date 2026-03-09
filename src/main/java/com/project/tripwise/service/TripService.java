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
        return tripRepository.findByCreatorIdOrCollaboratorsId(user.getId(), user.getId());
    }

    public Optional<Trip> getTripById(java.util.UUID id) {
        return tripRepository.findById(id);
    }

    // 1. Create a new trip
    public Trip createTrip(Trip trip) {
        User user = getCurrentUser();
        trip.setCreator(user);
        return tripRepository.save(trip);
    }

    // 2. Add a collaborator to a trip
    public String addCollaborator(java.util.UUID tripId, String username) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!trip.getCreator().getUsername().equals(currentUsername)) {
            throw new RuntimeException("Only the creator can add collaborators!");
        }

        User userToAdd = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User '" + username + "' not found"));

        if (trip.getCollaborators().contains(userToAdd)) {
            return "User " + username + " is already a collaborator.";
        }

        trip.getCollaborators().add(userToAdd);
        tripRepository.save(trip);

        return "Successfully added " + username + " to trip " + trip.getTitle();
    }

    // 3. Remove self from collaborators
    public String removeSelfFromCollaborators(java.util.UUID tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (trip.getCreator().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Creators cannot remove themselves. You must delete the trip instead.");
        }

        if (!trip.getCollaborators().contains(currentUser)) {
            throw new RuntimeException("You are not a collaborator of this trip.");
        }

        trip.getCollaborators().remove(currentUser);
        tripRepository.save(trip);

        return "You have successfully left the trip: " + trip.getTitle();
    }

    // 4. Remove a collaborator (only creator can do this)
    public void removeCollaborator(java.util.UUID tripId, String collaboratorUsername) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found"));
    
        User collaborator = userRepository.findByUsername(collaboratorUsername)
                .orElseThrow(() -> new RuntimeException("User not found"));
    
        if (!trip.getCollaborators().contains(collaborator)) {
            throw new RuntimeException("User is not a collaborator of this trip.");
        }
    
        trip.getCollaborators().remove(collaborator);
        tripRepository.save(trip);
    }
}