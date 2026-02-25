package com.project.tripwise.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.project.tripwise.model.Trip;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long>{
    
}
