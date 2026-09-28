package com.example.campus_lost.service;

import com.example.campus_lost.entity.LostReport;
import com.example.campus_lost.repository.LostReportRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LostReportService {

    private final LostReportRepository lostReportRepository;

    public LostReportService(LostReportRepository lostReportRepository) {
        this.lostReportRepository = lostReportRepository;
    }

    // CREATE
    public LostReport createLostReport(LostReport lostReport) {

        return lostReportRepository.save(lostReport);
    }

    // READ ALL
    public List<LostReport> getAllLostReports() {

        return lostReportRepository.findAll();
    }

    // READ BY ID
    public LostReport getLostReportById(Long id) {

        return lostReportRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Lost report not found"));
    }

    // UPDATE
    public LostReport updateLostReport(
            Long id,
            LostReport lostReport) {

        LostReport existingReport =
                getLostReportById(id);

        existingReport.setDescription(
                lostReport.getDescription());

        existingReport.setBrand(
                lostReport.getBrand());

        existingReport.setColor(
                lostReport.getColor());

        existingReport.setIdentifyingDetails(
                lostReport.getIdentifyingDetails());

        existingReport.setLocation(
                lostReport.getLocation());

        existingReport.setDate(
                lostReport.getDate());

        existingReport.setCategory(
                lostReport.getCategory());

        existingReport.setUser(
                lostReport.getUser());

        return lostReportRepository.save(existingReport);
    }

    // DELETE
    public void deleteLostReport(Long id) {

        LostReport existingReport =
                getLostReportById(id);

        lostReportRepository.delete(existingReport);
    }
}