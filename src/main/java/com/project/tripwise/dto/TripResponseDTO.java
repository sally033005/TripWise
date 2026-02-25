package com.project.tripwise.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.temporal.ChronoUnit;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;
import java.util.Comparator;

import com.project.tripwise.model.ItineraryItem;
import com.project.tripwise.model.Trip;
import com.project.tripwise.model.User;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TripResponseDTO {
    private Long id;
    private String title;
    private String destination;
    private LocalDate startDate;
    private LocalDate endDate;
    private String description;
    private String creatorName;
    private List<String> collaboratorNames;

    private Map<String, List<ItineraryItemDTO>> dailyItinerary;

    public TripResponseDTO(Trip trip) {
        this.id = trip.getId();
        this.title = trip.getTitle();
        this.destination = trip.getDestination();
        this.startDate = trip.getStartDate();
        this.endDate = trip.getEndDate();
        this.description = trip.getDescription();

        // 1. Map Creator Name
        if (trip.getCreator() != null) {
            this.creatorName = trip.getCreator().getUsername();
        }
        // 2. Map Collaborator Names
        this.collaboratorNames = trip.getCollaborators().stream()
                .map(User::getUsername)
                .collect(Collectors.toList());
        // 3. Map Itinerary Items grouped by day
        if (trip.getItineraryItems() != null && !trip.getItineraryItems().isEmpty()) {
            this.dailyItinerary = trip.getItineraryItems().stream()
                    .sorted(Comparator.comparing(ItineraryItem::getStartTime))
                    .map(item -> {
                        ItineraryItemDTO itemDto = new ItineraryItemDTO();
                        itemDto.setId(item.getId());
                        itemDto.setStartTime(item.getStartTime());
                        itemDto.setEndTime(item.getEndTime());
                        itemDto.setActivity(item.getActivity());
                        itemDto.setLocation(item.getLocation());
                        itemDto.setNotes(item.getNotes());
                        return itemDto;
                    })
                    .collect(Collectors.groupingBy(
                            item -> {
                                long dayNum = ChronoUnit.DAYS.between(trip.getStartDate(),
                                        item.getStartTime().toLocalDate()) + 1;
                                return "Day " + (dayNum > 0 ? dayNum : 1);
                            },
                            TreeMap::new, 
                            Collectors.toList() 
                    ));
        }
    }
}
