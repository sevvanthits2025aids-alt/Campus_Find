package com.example.campus_lost.service;

import com.example.campus_lost.entity.FoundItem;
import com.example.campus_lost.entity.Status;
import com.example.campus_lost.repository.FoundItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FoundItemService {

    private final FoundItemRepository foundItemRepository;

    public FoundItemService(FoundItemRepository foundItemRepository) {
        this.foundItemRepository = foundItemRepository;
    }

    public FoundItem createFoundItem(FoundItem foundItem) {

        if (foundItem.getStatus() == null) {
            foundItem.setStatus(Status.AVAILABLE);
        }

        return foundItemRepository.save(foundItem);
    }

    public List<FoundItem> getAllFoundItems() {
        return foundItemRepository.findAll();
    }

    public FoundItem getFoundItemById(Long id) {
        return foundItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Found item not found"));
    }

    public FoundItem updateFoundItem(Long id, FoundItem foundItem) {

        FoundItem existingItem = getFoundItemById(id);

        existingItem.setDescription(foundItem.getDescription());
        existingItem.setLocation(foundItem.getLocation());
        existingItem.setDate(foundItem.getDate());
        existingItem.setCategory(foundItem.getCategory());
        existingItem.setUser(foundItem.getUser());

        return foundItemRepository.save(existingItem);
    }

    public FoundItem updateStatus(Long id, Status newStatus) {

        FoundItem existingItem = getFoundItemById(id);

        Status currentStatus = existingItem.getStatus();

        if (currentStatus == Status.AVAILABLE
                && newStatus == Status.CLAIMED) {

            existingItem.setStatus(Status.CLAIMED);

        } else if (currentStatus == Status.CLAIMED
                && newStatus == Status.RETURNED) {

            existingItem.setStatus(Status.RETURNED);

        } else {

            throw new RuntimeException(
                    "Invalid status transition: "
                            + currentStatus + " -> " + newStatus
            );
        }

        return foundItemRepository.save(existingItem);
    }

    public void deleteFoundItem(Long id) {

        FoundItem existingItem = getFoundItemById(id);

        foundItemRepository.delete(existingItem);
    }
}