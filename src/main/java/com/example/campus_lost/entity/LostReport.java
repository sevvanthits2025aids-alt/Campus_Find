package com.example.campus_lost.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class LostReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;

    private String brand;

    private String color;

    private String identifyingDetails;

    private String location;

    private LocalDate date;

    @Enumerated(EnumType.STRING)
    private LostStatus status;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;


    // Default Constructor
    public LostReport() {
    }


    // Constructor
    public LostReport(
            String description,
            String brand,
            String color,
            String identifyingDetails,
            String location,
            LocalDate date,
            LostStatus status,
            Category category,
            User user) {

        this.description = description;
        this.brand = brand;
        this.color = color;
        this.identifyingDetails = identifyingDetails;
        this.location = location;
        this.date = date;
        this.status = status;
        this.category = category;
        this.user = user;
    }


    // ID
    public Long getId() {
        return id;
    }


    // Description
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }


    // Brand
    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }


    // Color
    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }


    // Identifying Details
    public String getIdentifyingDetails() {
        return identifyingDetails;
    }

    public void setIdentifyingDetails(String identifyingDetails) {
        this.identifyingDetails = identifyingDetails;
    }


    // Location
    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }


    // Date
    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }


    // Status
    public LostStatus getStatus() {
        return status;
    }

    public void setStatus(LostStatus status) {
        this.status = status;
    }


    // Category
    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }


    // User
    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}