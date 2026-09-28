package com.example.campus_lost.controller;

import com.example.campus_lost.entity.FoundItem;
import com.example.campus_lost.entity.Status;
import com.example.campus_lost.service.FoundItemService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/found-items")
public class FoundItemController {

    private final FoundItemService foundItemService;

    public FoundItemController(FoundItemService foundItemService) {
        this.foundItemService = foundItemService;
    }


    // CREATE
    @PostMapping
    public FoundItem createFoundItem(
            @RequestBody FoundItem foundItem) {

        return foundItemService.createFoundItem(foundItem);
    }


    // READ ALL
    @GetMapping
    public List<FoundItem> getAllFoundItems() {

        return foundItemService.getAllFoundItems();
    }


    // READ BY ID
    @GetMapping("/{id}")
    public FoundItem getFoundItemById(
            @PathVariable Long id) {

        return foundItemService.getFoundItemById(id);
    }


    // UPDATE
    @PutMapping("/{id}")
    public FoundItem updateFoundItem(
            @PathVariable Long id,
            @RequestBody FoundItem foundItem) {

        return foundItemService.updateFoundItem(
                id,
                foundItem);
    }


    // CLAIM / RETURN
    @PutMapping("/{id}/status")
    public FoundItem updateStatus(
            @PathVariable Long id,
            @RequestParam Status status) {

        return foundItemService.updateStatus(
                id,
                status);
    }


    // DELETE
    @DeleteMapping("/{id}")
    public String deleteFoundItem(
            @PathVariable Long id) {

        foundItemService.deleteFoundItem(id);

        return "Found item deleted successfully";
    }


    // HANDLE CLAIM / STATUS ERRORS
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(
            RuntimeException exception) {

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of(
                        "error",
                        exception.getMessage()
                ));
    }
}