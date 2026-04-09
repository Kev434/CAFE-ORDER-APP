package com.cafeapp.dto;

import com.cafeapp.entity.MenuItem;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record MenuItemResponse(
    UUID id,
    String name,
    String description,
    BigDecimal price,
    String category,
    String imageUrl,
    List<String> allergens
) {
    public static MenuItemResponse from(MenuItem item) {
        List<String> allergenNames = item.getAllergens().stream()
            .map(a -> a.getName())
            .sorted()
            .toList();
        return new MenuItemResponse(
            item.getId(), item.getName(), item.getDescription(),
            item.getPrice(), item.getCategory(), item.getImageUrl(),
            allergenNames
        );
    }
}
