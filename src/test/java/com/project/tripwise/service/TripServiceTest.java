package com.project.tripwise.service;

import com.project.tripwise.model.Trip;
import com.project.tripwise.model.User;
import com.project.tripwise.repository.TripRepository;
import com.project.tripwise.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TripServiceTest {

    @Mock
    private TripRepository tripRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private TripService tripService;

    private User creator;
    private User collaborator;
    private Trip trip;
    private UUID tripId;

    @BeforeEach
    void setUp() {
        tripId = UUID.randomUUID();

        creator = new User();
        creator.setId(1L);
        creator.setUsername("alice");

        collaborator = new User();
        collaborator.setId(2L);
        collaborator.setUsername("bob");

        trip = new Trip();
        trip.setId(tripId);
        trip.setTitle("Tokyo Trip");
        trip.setDestination("Tokyo");
        trip.setStartDate(LocalDate.of(2026, 8, 1));
        trip.setEndDate(LocalDate.of(2026, 8, 10));
        trip.setCreator(creator);
        trip.setCollaborators(new ArrayList<>());

        SecurityContextHolder.setContext(securityContext);
        when(securityContext.getAuthentication()).thenReturn(authentication);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void getAllTripsForUser_returnsTripsForCurrentUser() {
        when(authentication.getName()).thenReturn("alice");
        when(userRepository.findByUsername("alice")).thenReturn(Optional.of(creator));
        when(tripRepository.findByCreatorIdOrCollaboratorsId(1L, 1L)).thenReturn(List.of(trip));

        List<Trip> trips = tripService.getAllTripsForUser();

        assertEquals(1, trips.size());
        assertEquals("Tokyo Trip", trips.get(0).getTitle());
    }

    @Test
    void createTrip_setsCurrentUserAsCreator() {
        Trip newTrip = new Trip();
        newTrip.setTitle("Paris Trip");

        when(authentication.getName()).thenReturn("alice");
        when(userRepository.findByUsername("alice")).thenReturn(Optional.of(creator));
        when(tripRepository.save(newTrip)).thenAnswer(invocation -> invocation.getArgument(0));

        Trip result = tripService.createTrip(newTrip);

        assertEquals(creator, result.getCreator());
        verify(tripRepository).save(newTrip);
    }

    @Test
    void addCollaborator_addsUserWhenCreatorInvitesNewMember() {
        when(authentication.getName()).thenReturn("alice");
        when(tripRepository.findById(tripId)).thenReturn(Optional.of(trip));
        when(userRepository.findByUsername("bob")).thenReturn(Optional.of(collaborator));
        when(tripRepository.save(trip)).thenReturn(trip);

        String message = tripService.addCollaborator(tripId, "bob");

        assertTrue(trip.getCollaborators().contains(collaborator));
        assertEquals("Successfully added bob to trip Tokyo Trip", message);
    }

    @Test
    void addCollaborator_throwsWhenNonCreatorAttemptsInvite() {
        when(authentication.getName()).thenReturn("bob");
        when(tripRepository.findById(tripId)).thenReturn(Optional.of(trip));

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> tripService.addCollaborator(tripId, "bob"));

        assertEquals("Only the creator can add collaborators!", exception.getMessage());
        verify(tripRepository, never()).save(any(Trip.class));
    }

    @Test
    void addCollaborator_returnsMessageWhenUserAlreadyCollaborator() {
        trip.getCollaborators().add(collaborator);

        when(authentication.getName()).thenReturn("alice");
        when(tripRepository.findById(tripId)).thenReturn(Optional.of(trip));
        when(userRepository.findByUsername("bob")).thenReturn(Optional.of(collaborator));

        String message = tripService.addCollaborator(tripId, "bob");

        assertEquals("User bob is already a collaborator.", message);
        verify(tripRepository, never()).save(any(Trip.class));
    }

    @Test
    void removeSelfFromCollaborators_allowsCollaboratorToLeaveTrip() {
        trip.getCollaborators().add(collaborator);

        when(authentication.getName()).thenReturn("bob");
        when(tripRepository.findById(tripId)).thenReturn(Optional.of(trip));
        when(userRepository.findByUsername("bob")).thenReturn(Optional.of(collaborator));
        when(tripRepository.save(trip)).thenReturn(trip);

        String message = tripService.removeSelfFromCollaborators(tripId);

        assertFalse(trip.getCollaborators().contains(collaborator));
        assertEquals("You have successfully left the trip: Tokyo Trip", message);
    }

    @Test
    void removeSelfFromCollaborators_throwsWhenCreatorAttemptsToLeave() {
        when(authentication.getName()).thenReturn("alice");
        when(tripRepository.findById(tripId)).thenReturn(Optional.of(trip));
        when(userRepository.findByUsername("alice")).thenReturn(Optional.of(creator));

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> tripService.removeSelfFromCollaborators(tripId));

        assertEquals("Creators cannot remove themselves. You must delete the trip instead.",
                exception.getMessage());
    }
}
