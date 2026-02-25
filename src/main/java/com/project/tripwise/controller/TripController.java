package com.project.tripwise.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.project.tripwise.repository.ItineraryItemRepository;
import com.project.tripwise.repository.TripRepository;
import com.project.tripwise.repository.UserRepository;
import com.project.tripwise.dto.TripResponseDTO;
import com.project.tripwise.model.ItineraryItem;
import com.project.tripwise.model.Trip;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/trips")
public class TripController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private ItineraryItemRepository itineraryItemRepository;

    // Get all trips
    @GetMapping
    public List<TripResponseDTO> getAllTrips() {
        return tripRepository.findAll().stream()
                .map(TripResponseDTO::new) 
                .collect(Collectors.toList());
    }

    // Get a trip by ID
    @GetMapping("/{id}")
    public ResponseEntity<TripResponseDTO> getTripById(@PathVariable Long id) {
        return tripRepository.findById(id)
                .map(trip -> ResponseEntity.ok(new TripResponseDTO(trip))) 
                .orElse(ResponseEntity.notFound().build());
    }

    // Create a new trip
    @PostMapping
    public ResponseEntity<Trip> createTrip(@RequestBody Trip trip) {
        return userRepository.findById(1L).map(user -> {
            trip.setCreator(user);
            return ResponseEntity.ok(tripRepository.save(trip));
        }).orElse(ResponseEntity.badRequest().build());
    }

    // Update an existing trip
    @PutMapping("/{id}")
    public ResponseEntity<Trip> updateTrip(@PathVariable Long id, @RequestBody Trip tripDetails) {
        return tripRepository.findById(id).map(trip -> {
            trip.setTitle(tripDetails.getTitle());
            trip.setDestination(tripDetails.getDestination());
            trip.setStartDate(tripDetails.getStartDate());
            trip.setEndDate(tripDetails.getEndDate());
            trip.setDescription(tripDetails.getDescription());
            return ResponseEntity.ok(tripRepository.save(trip));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Delete a trip
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrip(@PathVariable Long id) {
        return tripRepository.findById(id).map(trip -> {
            tripRepository.delete(trip);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }

    // Add a collaborator to a trip
    @PostMapping("/{tripId}/collaborators/{username}")
    public ResponseEntity<String> addCollaborator(@PathVariable Long tripId, @PathVariable String username) {
        return tripRepository.findById(tripId).flatMap(trip -> userRepository.findByUsername(username).map(user -> {
            if (!trip.getCollaborators().contains(user)) {
                trip.getCollaborators().add(user);
                tripRepository.save(trip);
                return ResponseEntity
                        .ok("Successfully added " + username + " as a collaborator to trip " + trip.getTitle());
            }
            return ResponseEntity.badRequest()
                    .body("User " + username + " is already a collaborator on trip " + trip.getTitle());
        })).orElse(ResponseEntity.notFound().build());
    }

    // Add an itinerary item to a trip
    @PostMapping("/{tripId}/itinerary")
    public ResponseEntity<ItineraryItem> addItineraryItem(@PathVariable Long tripId, @RequestBody ItineraryItem item) {
        return tripRepository.findById(tripId).map(trip -> {
            item.setTrip(trip); // Set the trip reference in the itinerary item
            return ResponseEntity.ok(itineraryItemRepository.save(item));
        }).orElse(ResponseEntity.notFound().build());
    }
}
