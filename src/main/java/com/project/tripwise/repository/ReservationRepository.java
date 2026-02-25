package com.project.tripwise.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.project.tripwise.model.Reservation;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    // Find all reservations for a given trip
    List<Reservation> findByTripId(Long tripId);
}
