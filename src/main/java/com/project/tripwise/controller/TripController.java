package com.project.tripwise.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;

import com.project.tripwise.repository.ItineraryItemRepository;
import com.project.tripwise.repository.TripRepository;
import com.project.tripwise.repository.ReservationRepository;
import com.project.tripwise.service.FileService;
import com.project.tripwise.service.TripService;
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
    private TripRepository tripRepository;

    @Autowired
    private ItineraryItemRepository itineraryItemRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private FileService fileService;

    private final TripService tripService;

    public TripController(TripService tripService) {
        this.tripService = tripService;
    }

    // 1. Get all trips
    @GetMapping
    public List<TripResponseDTO> getAllTrips() {
        return tripService.getAllTripsForUser().stream()
                .map(TripResponseDTO::new)
                .collect(Collectors.toList());
    }

    // 2. Get a trip by ID
    @GetMapping("/{id}")
    @PreAuthorize("@tripSecurity.isMember(#id)")
    public ResponseEntity<TripResponseDTO> getTripById(@PathVariable java.util.UUID id) {
        return tripService.getTripById(id)
                .map(trip -> ResponseEntity.ok(new TripResponseDTO(trip)))
                .orElse(ResponseEntity.notFound().build());
    }

    // 3. Create a new trip
    @PostMapping
    public ResponseEntity<Trip> createTrip(@RequestBody Trip trip) {
        try {
            Trip savedTrip = tripService.createTrip(trip);
            return ResponseEntity.ok(savedTrip);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 4. Update an existing trip
    @PutMapping("/{id}")
    @PreAuthorize("@tripSecurity.isMember(#id)")
    public ResponseEntity<TripResponseDTO> updateTrip(@PathVariable java.util.UUID id, @RequestBody Trip tripDetails) {
        return tripRepository.findById(id).map(trip -> {
            trip.setTitle(tripDetails.getTitle());
            trip.setDestination(tripDetails.getDestination());
            trip.setStartDate(tripDetails.getStartDate());
            trip.setEndDate(tripDetails.getEndDate());
            trip.setDescription(tripDetails.getDescription());
            trip.setTotalBudget(tripDetails.getTotalBudget());

            Trip updatedTrip = tripRepository.save(trip);
            return ResponseEntity.ok(new TripResponseDTO(updatedTrip));
        }).orElse(ResponseEntity.notFound().build());
    }

    // 5. Delete a trip
    @DeleteMapping("/{id}")
    @PreAuthorize("@tripSecurity.isCreator(#id)")
    public ResponseEntity<?> deleteTrip(@PathVariable java.util.UUID id) {
        return tripRepository.findById(id).map(trip -> {
            // Delete associated files before deleting the trip record
            if (trip.getReservations() != null) {
                trip.getReservations().forEach(res -> {
                    if (res.getFilePath() != null) {
                        fileService.deleteFile(res.getFilePath());
                    }
                });
            }
            if (trip.getCoverPhoto() != null) {
                String fileName = trip.getCoverPhoto();
                if (fileName.contains("/")) {
                    fileName = fileName.substring(fileName.lastIndexOf("/") + 1);
                }
                System.out.println("Deleting cover photo file: " + fileName);
                fileService.deleteFile(fileName);
            }
            tripRepository.delete(trip);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    // 6. Add a collaborator to a trip
    @PostMapping("/{id}/collaborators")
    @PreAuthorize("@tripSecurity.isCreator(#id)")
    public ResponseEntity<?> addCollaborator(@PathVariable java.util.UUID id,
            @RequestBody Map<String, String> payload) {
        String username = payload.get("username");
        tripService.addCollaborator(id, username);
        return ResponseEntity.ok(Map.of("message", "Collaborator added successfully"));
    }

    // 7. Add an itinerary item to a trip
    @PostMapping("/{tripId}/itinerary")
    @PreAuthorize("@tripSecurity.isMember(#tripId)")
    public ResponseEntity<ItineraryItem> addItineraryItem(@PathVariable java.util.UUID tripId,
            @RequestBody ItineraryItem item) {
        return tripRepository.findById(tripId).map(trip -> {
            item.setTrip(trip); // Set the trip reference in the itinerary item
            return ResponseEntity.ok(itineraryItemRepository.save(item));
        }).orElse(ResponseEntity.notFound().build());
    }

    // 8. Delete an itinerary item from a trip
    @DeleteMapping("/{tripId}/itinerary/{itemId}")
    @PreAuthorize("@tripSecurity.isMember(#tripId)")
    public ResponseEntity<?> deleteItineraryItem(@PathVariable java.util.UUID tripId, @PathVariable Long itemId) {
        return itineraryItemRepository.findById(itemId).map(item -> {
            // Ensure the itinerary item belongs to the specified trip
            if (!item.getTrip().getId().equals(tripId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            itineraryItemRepository.delete(item);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    // 9. Edit an itinerary item of a trip
    @PutMapping("/{tripId}/itinerary/{itemId}")
    @PreAuthorize("@tripSecurity.isMember(#id)")
    public ResponseEntity<ItineraryItem> updateItineraryItem(
            @PathVariable java.util.UUID tripId,
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
    @PreAuthorize("@tripSecurity.isMember(#tripId)")
    public ResponseEntity<?> uploadReservation(
            @PathVariable java.util.UUID tripId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("category") String category,
            @RequestParam(value = "description", required = false) String description) {
        return tripRepository.findById(tripId).map(trip -> {
            try {
                String storedFileName = fileService.storeFile(file);

                Reservation res = new Reservation();
                res.setFileName(file.getOriginalFilename());
                res.setFilePath(storedFileName);
                res.setDownloadUrl("/api/reservations/download/" + storedFileName);
                res.setCategory(category);
                res.setDescription(description);
                res.setTrip(trip);

                reservationRepository.save(res);
                return ResponseEntity.ok("Uploaded");
            } catch (Exception e) {
                return ResponseEntity.internalServerError().build();
            }
        }).orElse(ResponseEntity.notFound().build());
    }

    // 11. Update the total budget of a trip
    @PatchMapping("/{id}/budget")
    @PreAuthorize("@tripSecurity.isMember(#id)")
    public ResponseEntity<?> updateBudget(@PathVariable java.util.UUID id, @RequestBody Double totalBudget) {
        return tripRepository.findById(id).map(trip -> {
            trip.setTotalBudget(totalBudget);
            tripRepository.save(trip);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    // 12. Upload a cover photo for a trip
    @PostMapping("/{id}/upload-cover")
    @PreAuthorize("@tripSecurity.isMember(#id)")
    public ResponseEntity<?> uploadCoverPhoto(@PathVariable java.util.UUID id,
            @RequestParam("file") MultipartFile file) {
        return tripRepository.findById(id).map(trip -> {
            try {
                String storedFileName = fileService.storeFile(file);

                trip.setCoverPhoto("/api/trips/cover/" + storedFileName);
                tripRepository.save(trip);

                return ResponseEntity.ok().body(Map.of("coverUrl", trip.getCoverPhoto()));
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Failed to upload image: " + e.getMessage());
            }
        }).orElse(ResponseEntity.notFound().build());
    }

    // 13. Get the cover photo for a trip
    @GetMapping("/cover/{fileName}")
    public ResponseEntity<Resource> getCoverPhoto(@PathVariable String fileName) {
        try {
            java.nio.file.Path filePath = java.nio.file.Paths.get("./uploads").toAbsolutePath().resolve(fileName)
                    .normalize();
            org.springframework.core.io.Resource resource = new org.springframework.core.io.UrlResource(
                    filePath.toUri());

            if (resource.exists()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_JPEG)
                        .body(resource);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // 14. Remove self from collaborators
    @DeleteMapping("/{tripId}/collaborators/self")
    @PreAuthorize("@tripSecurity.isMember(#tripId)")
    public ResponseEntity<String> removeSelf(@PathVariable java.util.UUID tripId) {
        try {
            String message = tripService.removeSelfFromCollaborators(tripId);
            return ResponseEntity.ok(message);
        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 15. Remove a specific collaborator (Only Creator can do this)
    @DeleteMapping("/{tripId}/collaborators/{username}")
    @PreAuthorize("@tripSecurity.isCreator(#tripId)")
    public ResponseEntity<?> kickCollaborator(
            @PathVariable java.util.UUID tripId,
            @PathVariable String username) {
        try {
            tripService.removeCollaborator(tripId, username);
            return ResponseEntity.ok(Map.of("message", "Collaborator removed successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
