package com.project.tripwise.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "reservations")
@Data
public class Reservation {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;
    private String fileType;
    private String filePath;
    private String downloadUrl;

    @ManyToOne
    @JoinColumn(name = "trip_id")
    private Trip trip;

}
