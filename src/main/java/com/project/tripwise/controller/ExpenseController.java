package com.project.tripwise.controller;

import com.project.tripwise.dto.ExpenseDTO;
import com.project.tripwise.model.Expense;
import com.project.tripwise.model.Trip;
import com.project.tripwise.repository.ExpenseRepository;
import com.project.tripwise.repository.TripRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = "http://localhost:3000")
public class ExpenseController {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private TripRepository tripRepository;

    // 1. Add a new expense to a trip
    @PostMapping("/trip/{tripId}")
    public ResponseEntity<ExpenseDTO> addExpense(@PathVariable Long tripId, @RequestBody ExpenseDTO dto) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        Expense expense = new Expense();
        expense.setDescription(dto.getDescription());
        expense.setAmount(dto.getAmount());
        expense.setCategory(dto.getCategory());
        expense.setPaidBy(dto.getPaidBy());
        expense.setTrip(trip);

        Expense saved = expenseRepository.save(expense);
        
        dto.setId(saved.getId());
        return ResponseEntity.ok(dto);
    }

    // 2. Delete an expense by ID
    @DeleteMapping("/{expenseId}")
    public ResponseEntity<?> deleteExpense(@PathVariable Long expenseId) {
        return expenseRepository.findById(expenseId).map(expense -> {
            expenseRepository.delete(expense);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}