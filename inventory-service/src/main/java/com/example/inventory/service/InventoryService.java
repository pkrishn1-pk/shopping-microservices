package com.example.inventory.service;

import com.example.inventory.model.InventoryItem;
import com.example.inventory.repository.InventoryRepository;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Objects;

@Service
public class InventoryService {
    private final InventoryRepository inventoryRepository;

    public InventoryService(InventoryRepository inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }

    public List<InventoryItem> getAllItems() {
        return inventoryRepository.findAll();
    }

    public InventoryItem addItem(InventoryItem item) {
        return Objects.requireNonNull(inventoryRepository.save(item));
    }

    public void updateStock(Long itemId, int quantity) {
        if (itemId != null) {
            InventoryItem item = inventoryRepository.findById(itemId).orElseThrow();
            item.setQuantity(quantity);
            inventoryRepository.save(item);
        }
    }

    public void deleteItem(Long itemId) {
        if (itemId != null) {
            inventoryRepository.deleteById(itemId);
        }
    }
}
