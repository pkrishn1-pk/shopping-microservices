package com.example.order.service;

import com.example.order.model.Order;
import com.example.order.repository.OrderRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class OrderService {
    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public List<Order> getOrders(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    public Order placeOrder(Order order) {
        order.setStatus("PLACED");
        return orderRepository.save(order);
    }

    public void cancelOrder(Long orderId) {
        if (orderId != null) {
            orderRepository.deleteById(orderId);
        }
    }
}
