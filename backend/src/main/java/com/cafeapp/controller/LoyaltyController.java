package com.cafeapp.controller;

import com.cafeapp.dto.LoyaltyResponse;
import com.cafeapp.entity.LoyaltyPoints;
import com.cafeapp.service.LoyaltyService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/loyalty")
public class LoyaltyController {
    private final LoyaltyService loyaltyService;

    public LoyaltyController(LoyaltyService loyaltyService) {
        this.loyaltyService = loyaltyService;
    }

    @GetMapping("/balance")
    public int getBalance(@AuthenticationPrincipal Jwt jwt) {
        UUID userId = UUID.fromString(jwt.getSubject());
        return loyaltyService.getBalance(userId);
    }

    @GetMapping("/history")
    public LoyaltyResponse getHistory(@AuthenticationPrincipal Jwt jwt) {
        UUID userId = UUID.fromString(jwt.getSubject());
        int balance = loyaltyService.getBalance(userId);
        List<LoyaltyResponse.PointsEntry> entries = loyaltyService.getHistory(userId).stream()
            .map(lp -> new LoyaltyResponse.PointsEntry(
                lp.getPointsEarned(), lp.getOrder().getId(), lp.getCreatedAt()
            )).toList();
        return new LoyaltyResponse(balance, entries);
    }
}
