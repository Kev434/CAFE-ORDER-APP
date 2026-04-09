package com.cafeapp.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Positive;
import java.util.List;
import java.util.UUID;

public record CreateOrderRequest(
    UUID userId,
    String guestName,
    @NotEmpty List<OrderItemRequest> items
) {
    public record OrderItemRequest(
        UUID menuItemId,
        @Positive int quantity,
        boolean surpriseDiscount
    ) {}
}
