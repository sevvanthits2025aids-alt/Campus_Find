package com.example.campus_lost.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class FoundItem {

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
    private Status status;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "lost_report_id")
    private LostReport lostReport;

    public FoundItem() {}

    public FoundItem(
            String description,
            String brand,
            String color,
            String identifyingDetails,
            String location,
            LocalDate date,
            Status status,
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

    public Long getId() {
        return id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getIdentifyingDetails() {
        return identifyingDetails;
    }

    public void setIdentifyingDetails(String identifyingDetails) {
        this.identifyingDetails = identifyingDetails;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public LostReport getLostReport() {
        return lostReport;
    }

    public void setLostReport(LostReport lostReport) {
        this.lostReport = lostReport;
    }
}