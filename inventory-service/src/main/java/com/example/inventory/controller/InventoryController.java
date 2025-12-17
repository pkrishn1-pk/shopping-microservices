package com.example.inventory.controller;

import com.example.inventory.model.InventoryItem;
import com.example.inventory.service.InventoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/inventory")
public class InventoryController {
    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @GetMapping
    public List<InventoryItem> getAllItems() {
        return inventoryService.getAllItems();
    }

    @PostMapping
    public InventoryItem addItem(@RequestBody InventoryItem item) {
        return inventoryService.addItem(item);
    }

    @PutMapping("/{id}/stock")
    public void updateStock(@PathVariable Long id, @RequestParam int quantity) {
        inventoryService.updateStock(id, quantity);
    }

    @DeleteMapping("/{id}")
    public void deleteItem(@PathVariable Long id) {
        inventoryService.deleteItem(id);
    }
}
