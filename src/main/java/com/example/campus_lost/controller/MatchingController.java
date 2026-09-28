package com.example.campus_lost.controller;

import com.example.campus_lost.entity.FoundItem;
import com.example.campus_lost.service.MatchingService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/matching")
public class MatchingController {

    private final MatchingService matchingService;

    public MatchingController(MatchingService matchingService) {
        this.matchingService = matchingService;
    }

    @GetMapping("/{lostReportId}")
    public List<FoundItem> findMatches(
            @PathVariable Long lostReportId) {

        return matchingService.findMatches(lostReportId);
    }
}