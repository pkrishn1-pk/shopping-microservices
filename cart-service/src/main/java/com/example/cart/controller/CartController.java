package com.example.cart.controller;

import com.example.cart.model.CartItem;
import com.example.cart.service.CartService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cart")
public class CartController {
    private final CartService cartService;
    public CartController(CartService cartService) {
        this.cartService = cartService;
    }
    @GetMapping("/{userId}")
    public List<CartItem> getCartItems(@PathVariable Long userId) {
        return cartService.getCartItems(userId);
    }
    @PostMapping("/{userId}")
    public CartItem addItem(@PathVariable Long userId, @RequestBody CartItem item) {
        return cartService.addItemToCart(userId, item);
    }
    @DeleteMapping("/{itemId}")
    public void removeItem(@PathVariable Long itemId) {
        cartService.removeItemFromCart(itemId);
    }
}
