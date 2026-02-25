package com.project.tripwise.dto;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class ItineraryItemDTO {
    private Long id;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String activity;
    private String location;
    private String notes;
}
