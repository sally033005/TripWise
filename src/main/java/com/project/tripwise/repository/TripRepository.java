package com.project.tripwise.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.project.tripwise.model.Trip;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {
    List<Trip> findByCreatorId(Long creatorId);
    List<Trip> findByCreatorIdOrCollaboratorsId(Long creatorId, Long collaboratorId);
}
