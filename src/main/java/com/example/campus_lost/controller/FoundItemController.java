package com.example.campus_lost.controller;

import com.example.campus_lost.entity.FoundItem;
import com.example.campus_lost.entity.Status;
import com.example.campus_lost.service.FoundItemService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/found-items")
public class FoundItemController {

    private final FoundItemService foundItemService;

    public FoundItemController(FoundItemService foundItemService) {
        this.foundItemService = foundItemService;
    }

    @PostMapping
    public FoundItem createFoundItem(@RequestBody FoundItem foundItem) {
        return foundItemService.createFoundItem(foundItem);
    }

    @GetMapping
    public List<FoundItem> getAllFoundItems() {
        return foundItemService.getAllFoundItems();
    }

    @GetMapping("/{id}")
    public FoundItem getFoundItemById(@PathVariable Long id) {
        return foundItemService.getFoundItemById(id);
    }

    @PutMapping("/{id}")
    public FoundItem updateFoundItem(
            @PathVariable Long id,
            @RequestBody FoundItem foundItem) {

        return foundItemService.updateFoundItem(id, foundItem);
    }

    @PutMapping("/{id}/status")
    public FoundItem updateStatus(
            @PathVariable Long id,
            @RequestParam Status status) {

        return foundItemService.updateStatus(id, status);
    }

    @DeleteMapping("/{id}")
    public String deleteFoundItem(@PathVariable Long id) {

        foundItemService.deleteFoundItem(id);

        return "Found item deleted successfully";
    }
}