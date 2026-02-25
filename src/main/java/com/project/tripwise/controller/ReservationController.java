package com.project.tripwise.controller;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.project.tripwise.model.Reservation;
import com.project.tripwise.repository.ReservationRepository;
import com.project.tripwise.repository.TripRepository;
import com.project.tripwise.service.FileService;

@RestController
@RequestMapping("/api/trips/{tripId}/reservations")
public class ReservationController {
    @Autowired
    private FileService fileService;

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private TripRepository tripRepository;

    // 1. Upload a reservation file for a specific trip
    @PostMapping("/upload")
    public ResponseEntity<?> uploadReservation(
            @PathVariable Long tripId,
            @RequestParam("file") MultipartFile file) {

        return tripRepository.findById(tripId).map(trip -> {
            try {
                // A. Store the file on the server and get the stored file name/path
                String fileName = fileService.storeFile(file);

                // B. Create a new Reservation entity and save it to the database
                Reservation reservation = new Reservation();
                reservation.setFileName(file.getOriginalFilename());
                reservation.setFileType(file.getContentType());
                reservation.setFilePath(fileName);
                reservation.setTrip(trip);

                return ResponseEntity.ok(reservationRepository.save(reservation));
            } catch (Exception e) {
                return ResponseEntity.internalServerError().body("File upload failed: " + e.getMessage());
            }
        }).orElse(ResponseEntity.notFound().build());
    }

    // 2. Get all reservations for a specific trip
    @GetMapping
    public List<Reservation> getReservationsByTrip(@PathVariable Long tripId) {
        return reservationRepository.findByTripId(tripId);
    }

    // 3. Download or preview a reservation file
    @GetMapping("/download/{reservationId}")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long reservationId) {
        // A. Find the reservation record in the database using the reservationId
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation not found with id " + reservationId));

        try {
            // B. Retrieve the file from the server using the stored file path
            Path filePath = Paths.get("./uploads").toAbsolutePath().resolve(reservation.getFilePath()).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists()) {
                // C. Return the file as a response, setting the appropriate content type and headers for download or preview
                String contentType = reservation.getFileType();
                if (contentType == null)
                    contentType = "application/octet-stream";

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        // Set the Content-Disposition header to inline for preview or attachment for download
                        .header(HttpHeaders.CONTENT_DISPOSITION,
                                "inline; filename=\"" + reservation.getFileName() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException ex) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
