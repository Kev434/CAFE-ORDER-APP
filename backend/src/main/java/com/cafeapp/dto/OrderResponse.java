package com.cafeapp.dto;

import com.cafeapp.entity.Order;
import com.cafeapp.entity.OrderItem;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record OrderResponse(
    UUID id,
    String status,
    BigDecimal total,
    LocalDateTime createdAt,
    String guestName,
    List<OrderItemDetail> items
) {
    public record OrderItemDetail(
        String name,
        int quantity,
        BigDecimal price
    ) {}

    public static OrderResponse from(Order order) {
        List<OrderItemDetail> items = order.getItems().stream()
            .map(oi -> new OrderItemDetail(
                oi.getMenuItem().getName(),
                oi.getQuantity(),
                oi.getPriceAtPurchase()
            )).toList();
        return new OrderResponse(
            order.getId(), order.getStatus(), order.getTotal(),
            order.getCreatedAt(), order.getGuestName(), items
        );
    }
}
