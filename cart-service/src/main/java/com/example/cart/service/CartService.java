package com.example.cart.service;

import com.example.cart.model.CartItem;
import com.example.cart.repository.CartRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CartService {
    private final CartRepository cartRepository;

    public CartService(CartRepository cartRepository) {
        this.cartRepository = cartRepository;
    }

    public List<CartItem> getCartItems(Long userId) {
        return cartRepository.findByUserId(userId);
    }

    public CartItem addItemToCart(Long userId, CartItem item) {
        item.setUserId(userId);
        return cartRepository.save(item);
    }

    public void removeItemFromCart(Long itemId) {
        if (itemId != null) {
            cartRepository.deleteById(itemId);
        }
    }
}
