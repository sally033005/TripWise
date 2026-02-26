package com.project.tripwise.dto;

import com.project.tripwise.model.ExpenseCategory;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseDTO {
    private Long id;
    private String description;
    private Double amount;
    private ExpenseCategory category;
    private String paidBy;
}
