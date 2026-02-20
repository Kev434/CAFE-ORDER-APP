package com.cafeapp.service;

import com.cafeapp.dto.CreateOrderRequest;
import com.cafeapp.entity.MenuItem;
import com.cafeapp.entity.Order;
import com.cafeapp.entity.OrderItem;
import com.cafeapp.repository.MenuItemRepository;
import com.cafeapp.repository.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final MenuItemRepository menuItemRepository;
    private final LoyaltyService loyaltyService;

    public OrderService(OrderRepository orderRepository, MenuItemRepository menuItemRepository, LoyaltyService loyaltyService) {
        this.orderRepository = orderRepository;
        this.menuItemRepository = menuItemRepository;
        this.loyaltyService = loyaltyService;
    }

    @Transactional
    public Order createOrder(CreateOrderRequest request) {
        Order order = new Order();
        order.setUserId(request.userId());
        order.setGuestName(request.guestName());

        BigDecimal total = BigDecimal.ZERO;
        for (CreateOrderRequest.OrderItemRequest itemReq : request.items()) {
            MenuItem menuItem = menuItemRepository.findById(itemReq.menuItemId())
                .orElseThrow(() -> new IllegalArgumentException("Menu item not found: " + itemReq.menuItemId()));

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setMenuItem(menuItem);
            orderItem.setQuantity(itemReq.quantity());
            orderItem.setPriceAtPurchase(menuItem.getPrice());
            order.getItems().add(orderItem);

            total = total.add(menuItem.getPrice().multiply(BigDecimal.valueOf(itemReq.quantity())));
        }
        order.setTotal(total);
        Order saved = orderRepository.save(order);

        if (request.userId() != null) {
            loyaltyService.awardPoints(request.userId(), saved);
        }

        return saved;
    }

    public Order getOrderById(UUID id) {
        return orderRepository.findById(id).orElse(null);
    }

    public List<Order> getOrdersByUserId(UUID userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
}
