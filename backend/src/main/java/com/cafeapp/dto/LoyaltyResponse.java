package com.cafeapp.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record LoyaltyResponse(
    int balance,
    List<PointsEntry> history
) {
    public record PointsEntry(
        int pointsEarned,
        UUID orderId,
        LocalDateTime createdAt
    ) {}
}
