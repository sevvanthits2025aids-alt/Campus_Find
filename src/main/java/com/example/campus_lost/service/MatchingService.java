package com.example.campus_lost.service;

import com.example.campus_lost.entity.FoundItem;
import com.example.campus_lost.entity.LostReport;
import com.example.campus_lost.entity.LostStatus;
import com.example.campus_lost.entity.Status;
import com.example.campus_lost.repository.FoundItemRepository;
import com.example.campus_lost.repository.LostReportRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class MatchingService {

    private final LostReportRepository lostReportRepository;
    private final FoundItemRepository foundItemRepository;

    public MatchingService(
            LostReportRepository lostReportRepository,
            FoundItemRepository foundItemRepository) {

        this.lostReportRepository = lostReportRepository;
        this.foundItemRepository = foundItemRepository;
    }

    public List<FoundItem> findMatches(Long lostReportId) {

        LostReport lostReport =
                lostReportRepository.findById(lostReportId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Lost report not found"));

        List<FoundItem> foundItems =
                foundItemRepository.findAll();

        List<FoundItem> matches =
                new ArrayList<>();

        for (FoundItem foundItem : foundItems) {

            if (foundItem.getStatus() != Status.AVAILABLE) {
                continue;
            }

            if (foundItem.getCategory() == null ||
                    lostReport.getCategory() == null) {
                continue;
            }

            if (!foundItem.getCategory().getId()
                    .equals(lostReport.getCategory().getId())) {

                continue;
            }

            boolean keywordMatch =
                    hasKeywordMatch(
                            lostReport.getDescription(),
                            foundItem.getDescription());

            boolean locationMatch =
                    lostReport.getLocation()
                            .equalsIgnoreCase(
                                    foundItem.getLocation());

            if (keywordMatch || locationMatch) {

                foundItem.setLostReport(lostReport);

                lostReport.setStatus(
                        LostStatus.MATCHED);

                foundItemRepository.save(foundItem);

                lostReportRepository.save(lostReport);

                matches.add(foundItem);
            }
        }

        return matches;
    }

    private boolean hasKeywordMatch(
            String lostDescription,
            String foundDescription) {

        String[] lostWords =
                lostDescription
                        .toLowerCase()
                        .split("\\s+");

        String foundText =
                foundDescription.toLowerCase();

        for (String word : lostWords) {

            if (word.length() > 2 &&
                    foundText.contains(word)) {

                return true;
            }
        }

        return false;
    }
}