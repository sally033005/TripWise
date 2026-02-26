package com.project.tripwise.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.project.tripwise.repository.ItineraryItemRepository;
import com.project.tripwise.repository.TripRepository;
import com.project.tripwise.repository.UserRepository;
import com.project.tripwise.repository.ReservationRepository;
import com.project.tripwise.service.FileService;
import com.project.tripwise.dto.TripResponseDTO;
import com.project.tripwise.model.ItineraryItem;
import com.project.tripwise.model.Reservation;
import com.project.tripwise.model.Trip;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/trips")
@CrossOrigin(origins = "http://localhost:3000")
public class TripController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private ItineraryItemRepository itineraryItemRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private FileService fileService;

    // 1. Get all trips
    @GetMapping
    public List<TripResponseDTO> getAllTrips() {
        return tripRepository.findAll().stream()
                .map(TripResponseDTO::new)
                .collect(Collectors.toList());
    }

    // 2. Get a trip by ID
    @GetMapping("/{id}")
    public ResponseEntity<TripResponseDTO> getTripById(@PathVariable Long id) {
        return tripRepository.findById(id)
                .map(trip -> ResponseEntity.ok(new TripResponseDTO(trip)))
                .orElse(ResponseEntity.notFound().build());
    }

    // 3. Create a new trip
    @PostMapping
    public ResponseEntity<Trip> createTrip(@RequestBody Trip trip) {
        return userRepository.findById(1L).map(user -> {
            trip.setCreator(user);
            return ResponseEntity.ok(tripRepository.save(trip));
        }).orElse(ResponseEntity.badRequest().build());
    }

    // 4. Update an existing trip
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

    // 5. Delete a trip
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTrip(@PathVariable Long id) {
        return tripRepository.findById(id).map(trip -> {
            // Delete associated itinerary items
            trip.getReservations().forEach(res -> fileService.deleteFile(res.getFilePath()));

            // Delete the trip itself
            tripRepository.delete(trip);

            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    // 6. Add a collaborator to a trip
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

    // 7. Add an itinerary item to a trip
    @PostMapping("/{tripId}/itinerary")
    public ResponseEntity<ItineraryItem> addItineraryItem(@PathVariable Long tripId, @RequestBody ItineraryItem item) {
        return tripRepository.findById(tripId).map(trip -> {
            item.setTrip(trip); // Set the trip reference in the itinerary item
            return ResponseEntity.ok(itineraryItemRepository.save(item));
        }).orElse(ResponseEntity.notFound().build());
    }

    // 8. Delete an itinerary item from a trip
    @DeleteMapping("/{tripId}/itinerary/{itemId}")
    public ResponseEntity<?> deleteItineraryItem(@PathVariable Long tripId, @PathVariable Long itemId) {
        return itineraryItemRepository.findById(itemId).map(item -> {
            itineraryItemRepository.delete(item);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    // 9. Edit an itinerary item of a trip
    @PutMapping("/{tripId}/itinerary/{itemId}")
    public ResponseEntity<ItineraryItem> updateItineraryItem(
            @PathVariable Long tripId,
            @PathVariable Long itemId,
            @RequestBody ItineraryItem itemDetails) {

        return itineraryItemRepository.findById(itemId).map(item -> {
            item.setActivity(itemDetails.getActivity());
            item.setStartTime(itemDetails.getStartTime());
            item.setLocation(itemDetails.getLocation());
            item.setNotes(itemDetails.getNotes());
            return ResponseEntity.ok(itineraryItemRepository.save(item));
        }).orElse(ResponseEntity.notFound().build());
    }

    // 10. Upload a reservation file for a trip
    @PostMapping("/{tripId}/reservations/upload")
    public ResponseEntity<?> uploadReservation(@PathVariable Long tripId, @RequestParam("file") MultipartFile file) {
        return tripRepository.findById(tripId).map(trip -> {
            try {
                String storedFileName = fileService.storeFile(file); // a. Store the file and get the stored file
                                                                     // name/path

                Reservation res = new Reservation();
                res.setFileName(file.getOriginalFilename());
                res.setFilePath(storedFileName);
                res.setDownloadUrl("/api/files/download/" + storedFileName);
                res.setTrip(trip); // b. Set the trip reference in the reservation record

                reservationRepository.save(res); // c. Save the reservation record in the database

                return ResponseEntity.ok("Uploaded");
            } catch (Exception e) {
                return ResponseEntity.internalServerError().build();
            }
        }).orElse(ResponseEntity.notFound().build());
    }
}
