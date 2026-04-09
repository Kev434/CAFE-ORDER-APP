package com.cafeapp.dto;

import com.cafeapp.entity.MenuItem;
import java.math.BigDecimal;
import java.util.UUID;

public record MenuItemResponse(
    UUID id,
    String name,
    String description,
    BigDecimal price,
    String category,
    String imageUrl
) {
    public static MenuItemResponse from(MenuItem item) {
        return new MenuItemResponse(
            item.getId(), item.getName(), item.getDescription(),
            item.getPrice(), item.getCategory(), item.getImageUrl()
        );
    }
}
