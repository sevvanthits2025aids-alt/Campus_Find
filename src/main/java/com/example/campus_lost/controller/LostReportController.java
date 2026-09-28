package com.example.campus_lost.controller;

import com.example.campus_lost.entity.LostReport;
import com.example.campus_lost.service.LostReportService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/lost-reports")
public class LostReportController {

    private final LostReportService lostReportService;

    public LostReportController(
            LostReportService lostReportService) {

        this.lostReportService = lostReportService;
    }

    @PostMapping
    public LostReport createLostReport(
            @RequestBody LostReport lostReport) {

        return lostReportService.createLostReport(lostReport);
    }

    @GetMapping
    public List<LostReport> getAllLostReports() {

        return lostReportService.getAllLostReports();
    }

    @GetMapping("/{id}")
    public LostReport getLostReportById(
            @PathVariable Long id) {

        return lostReportService.getLostReportById(id);
    }

    @PutMapping("/{id}")
    public LostReport updateLostReport(
            @PathVariable Long id,
            @RequestBody LostReport lostReport) {

        return lostReportService.updateLostReport(
                id,
                lostReport);
    }

    @DeleteMapping("/{id}")
    public String deleteLostReport(
            @PathVariable Long id) {

        lostReportService.deleteLostReport(id);

        return "Lost report deleted successfully";
    }
}