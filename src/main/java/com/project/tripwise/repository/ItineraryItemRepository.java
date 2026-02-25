package com.project.tripwise.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.project.tripwise.model.ItineraryItem;

public interface ItineraryItemRepository extends JpaRepository<ItineraryItem, Long> {
    // Find all itinerary items for a given itinerary, ordered by start time
    List<ItineraryItem> findByTripIdOrderByStartTimeAsc(Long tripId);
}
