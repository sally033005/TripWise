package com.project.tripwise.security;

import com.project.tripwise.model.Trip;
import com.project.tripwise.repository.TripRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component("tripSecurity")
public class TripSecurity {

    @Autowired
    private TripRepository tripRepository;

    public boolean isMember(java.util.UUID tripId) {
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();

        return tripRepository.findById(tripId).map(trip -> {
            boolean isCreator = trip.getCreator().getUsername().equals(currentUsername);

            boolean isCollaborator = trip.getCollaborators().stream()
                    .anyMatch(u -> u.getUsername().equals(currentUsername));

            return isCreator || isCollaborator;
        }).orElse(false);
    }

    public boolean isCreator(java.util.UUID tripId) {
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        return tripRepository.findById(tripId)
                .map(trip -> trip.getCreator().getUsername().equals(currentUsername))
                .orElse(false);
    }
}