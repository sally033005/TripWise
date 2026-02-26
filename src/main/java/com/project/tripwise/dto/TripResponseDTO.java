package com.project.tripwise.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;
import java.util.Comparator;

import com.project.tripwise.model.Expense;
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
    private List<ReservationDTO> reservations;
    private Double totalBudget;
    private Double totalSpent;
    private Map<String, Double> spentByPerson;
    private List<ExpenseDTO> expenses;

    public TripResponseDTO(Trip trip) {
        this.id = trip.getId();
        this.title = trip.getTitle();
        this.destination = trip.getDestination();
        this.startDate = trip.getStartDate();
        this.endDate = trip.getEndDate();
        this.description = trip.getDescription();
        this.totalBudget = trip.getTotalBudget();

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
                            item -> item.getStartTime().toLocalDate().toString(), // Group by date string
                            TreeMap::new, // Use TreeMap to keep keys sorted
                            Collectors.toList()));
        }
        // 4. Map Reservations with download URLs
        if (trip.getReservations() != null) {
            this.reservations = trip.getReservations().stream()
                    .map(res -> {
                        ReservationDTO rDto = new ReservationDTO();
                        rDto.setId(res.getId());
                        rDto.setFileName(res.getFileName());
                        // Set the download URL for each reservation file
                        rDto.setDownloadUrl("/api/trips/" + trip.getId() + "/reservations/download/" + res.getId());
                        return rDto;
                    })
                    .collect(Collectors.toList());
        }

        // 5. Map Expenses and calculate totals
        this.totalSpent = trip.getExpenses().stream()
                .mapToDouble(Expense::getAmount)
                .sum();

        this.spentByPerson = trip.getExpenses().stream()
                .collect(Collectors.groupingBy(
                        Expense::getPaidBy,
                        Collectors.summingDouble(Expense::getAmount)));

        this.expenses = trip.getExpenses().stream()
                .map(e -> {
                    ExpenseDTO dto = new ExpenseDTO();
                    dto.setId(e.getId());
                    dto.setDescription(e.getDescription());
                    dto.setAmount(e.getAmount());
                    dto.setCategory(e.getCategory());
                    dto.setPaidBy(e.getPaidBy());
                    return dto;
                }).collect(Collectors.toList());
    }
}
