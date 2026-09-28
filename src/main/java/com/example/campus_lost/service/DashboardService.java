package com.example.campus_lost.service;

import com.example.campus_lost.entity.FoundItem;
import com.example.campus_lost.entity.LostReport;
import com.example.campus_lost.entity.LostStatus;
import com.example.campus_lost.entity.Status;
import com.example.campus_lost.repository.FoundItemRepository;
import com.example.campus_lost.repository.LostReportRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {

    private final FoundItemRepository foundItemRepository;
    private final LostReportRepository lostReportRepository;

    public DashboardService(
            FoundItemRepository foundItemRepository,
            LostReportRepository lostReportRepository) {

        this.foundItemRepository = foundItemRepository;
        this.lostReportRepository = lostReportRepository;
    }

    public Map<String, Long> getDashboardCounts() {

        List<LostReport> lostReports =
                lostReportRepository.findAll();

        List<FoundItem> foundItems =
                foundItemRepository.findAll();

        long lostReportsCount = 0;
        long foundItemsCount = 0;
        long returned = 0;

        for (LostReport report : lostReports) {

            if (report.getStatus() == LostStatus.LOST
                    || report.getStatus() == LostStatus.MATCHED) {

                lostReportsCount++;
            }

            if (report.getStatus() == LostStatus.RETURNED) {
                returned++;
            }
        }

        for (FoundItem item : foundItems) {

            if (item.getStatus() == Status.AVAILABLE
                    || item.getStatus() == Status.CLAIMED) {

                foundItemsCount++;
            }
        }

        Map<String, Long> counts =
                new HashMap<>();

        counts.put("lostReports", lostReportsCount);
        counts.put("foundItems", foundItemsCount);
        counts.put("returned", returned);

        return counts;
    }
}