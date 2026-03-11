package com.project.tripwise.controller;

import java.nio.file.Files;
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

import com.project.tripwise.model.Reservation;
import com.project.tripwise.repository.ReservationRepository;
import com.project.tripwise.service.FileService;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "http://localhost:3000")
public class ReservationController {
    @Autowired
    private FileService fileService;

    @Autowired
    private ReservationRepository reservationRepository;

    // 1. Get all reservations for a specific trip
    @GetMapping
    public List<Reservation> getReservationsByTrip(@PathVariable Long tripId) {
        return reservationRepository.findByTripId(tripId);
    }

    // 2. Download or preview a reservation file
    @GetMapping("/download/{fileName:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName) {
        Reservation reservation = reservationRepository.findByFilePath(fileName)
                .orElseThrow(() -> new RuntimeException("File record not found in database"));

        try {
            Path filePath = Paths.get("./uploads").toAbsolutePath().resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists()) {
                String contentType = reservation.getFileType();
                if (contentType == null) {
                    contentType = Files.probeContentType(filePath);
                }
                if (contentType == null)
                    contentType = "application/octet-stream";

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION,
                                "inline; filename=\"" + reservation.getFileName() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception ex) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // 3. Delete a reservation file
    @DeleteMapping("/{reservationId}")
    public ResponseEntity<?> deleteReservation(@PathVariable Long reservationId) {
        return reservationRepository.findById(reservationId).map(reservation -> {
            // A. Find the reservation record in the database using the reservationId
            String fileNameInFolder = reservation.getFilePath();

            // B. Delete the reservation record from the database
            reservationRepository.delete(reservation);

            // C. Delete the file from the server using the stored file path
            fileService.deleteFile(fileNameInFolder);

            return ResponseEntity.ok().body("Reservation deleted successfully");
        }).orElse(ResponseEntity.notFound().build());
    }
}
