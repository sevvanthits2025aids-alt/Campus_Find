package com.example.campus_lost.service;

import com.example.campus_lost.entity.FoundItem;
import com.example.campus_lost.entity.LostReport;
import com.example.campus_lost.entity.LostStatus;
import com.example.campus_lost.entity.Status;
import com.example.campus_lost.repository.FoundItemRepository;
import com.example.campus_lost.repository.LostReportRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FoundItemService {

    private final FoundItemRepository foundItemRepository;
    private final LostReportRepository lostReportRepository;

    public FoundItemService(
            FoundItemRepository foundItemRepository,
            LostReportRepository lostReportRepository) {

        this.foundItemRepository = foundItemRepository;
        this.lostReportRepository = lostReportRepository;
    }


    // CREATE
    public FoundItem createFoundItem(FoundItem foundItem) {

        if (foundItem.getStatus() == null) {
            foundItem.setStatus(Status.AVAILABLE);
        }

        return foundItemRepository.save(foundItem);
    }


    // READ ALL
    public List<FoundItem> getAllFoundItems() {

        return foundItemRepository.findAll();
    }


    // READ BY ID
    public FoundItem getFoundItemById(Long id) {

        return foundItemRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Found item not found"));
    }


    // UPDATE
    public FoundItem updateFoundItem(
            Long id,
            FoundItem foundItem) {

        FoundItem existingItem =
                getFoundItemById(id);

        existingItem.setDescription(
                foundItem.getDescription());

        // BRAND UPDATE
        existingItem.setBrand(
                foundItem.getBrand());

        // COLOR UPDATE
        existingItem.setColor(
                foundItem.getColor());

        // IDENTIFYING DETAILS UPDATE
        existingItem.setIdentifyingDetails(
                foundItem.getIdentifyingDetails());

        existingItem.setLocation(
                foundItem.getLocation());

        existingItem.setDate(
                foundItem.getDate());

        existingItem.setCategory(
                foundItem.getCategory());

        existingItem.setUser(
                foundItem.getUser());

        return foundItemRepository.save(existingItem);
    }


    // STATUS UPDATE
    @Transactional
    public FoundItem updateStatus(
            Long id,
            Status newStatus) {

        FoundItem existingItem =
                getFoundItemById(id);

        Status currentStatus =
                existingItem.getStatus();


        // ==========================================
        // AVAILABLE -> CLAIMED
        // ==========================================
        if (currentStatus == Status.AVAILABLE
                && newStatus == Status.CLAIMED) {

            LostReport matchedLostReport =
                    findMatchingLostReport(existingItem);

            // No matching lost report
            if (matchedLostReport == null) {

                throw new RuntimeException(
                        "Claim not allowed. "
                                + "Category, Brand, Color and "
                                + "Identifying Details do not match "
                                + "any lost report.");
            }

            // Match found
            existingItem.setStatus(Status.CLAIMED);

            // Connect found item with matching lost report
            existingItem.setLostReport(
                    matchedLostReport);
        }


        // ==========================================
        // CLAIMED -> RETURNED
        // ==========================================
        else if (currentStatus == Status.CLAIMED
                && newStatus == Status.RETURNED) {

            existingItem.setStatus(Status.RETURNED);

            LostReport lostReport =
                    existingItem.getLostReport();

            if (lostReport != null) {

                lostReport.setStatus(
                        LostStatus.RETURNED);

                lostReportRepository.save(lostReport);
            }
        }


        // ==========================================
        // INVALID STATUS
        // ==========================================
        else {

            throw new RuntimeException(
                    "Invalid status transition: "
                            + currentStatus
                            + " -> "
                            + newStatus);
        }

        return foundItemRepository.save(existingItem);
    }


    // ==========================================
    // FIND MATCHING LOST REPORT
    // ==========================================
    private LostReport findMatchingLostReport(
            FoundItem foundItem) {

        List<LostReport> lostReports =
                lostReportRepository.findAll();

        for (LostReport lostReport : lostReports) {

            // CATEGORY MATCH
            boolean categoryMatch =
                    lostReport.getCategory() != null
                            && foundItem.getCategory() != null
                            && lostReport.getCategory()
                            .getId()
                            .equals(
                                    foundItem.getCategory()
                                            .getId());


            // BRAND MATCH
            boolean brandMatch =
                    sameText(
                            lostReport.getBrand(),
                            foundItem.getBrand());


            // COLOR MATCH
            boolean colorMatch =
                    sameText(
                            lostReport.getColor(),
                            foundItem.getColor());


            // IDENTIFYING DETAILS MATCH
            boolean detailsMatch =
                    sameText(
                            lostReport.getIdentifyingDetails(),
                            foundItem.getIdentifyingDetails());


            // ALL DETAILS MUST MATCH
            if (categoryMatch
                    && brandMatch
                    && colorMatch
                    && detailsMatch) {

                return lostReport;
            }
        }

        return null;
    }


    // ==========================================
    // TEXT MATCHING
    // ==========================================
    private boolean sameText(
            String first,
            String second) {

        if (first == null || second == null) {
            return false;
        }

        return first.trim()
                .equalsIgnoreCase(
                        second.trim());
    }


    // DELETE
    public void deleteFoundItem(Long id) {

        FoundItem existingItem =
                getFoundItemById(id);

        foundItemRepository.delete(existingItem);
    }
}