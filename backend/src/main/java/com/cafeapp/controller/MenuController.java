package com.cafeapp.controller;

import com.cafeapp.dto.MenuItemResponse;
import com.cafeapp.entity.MenuItem;
import com.cafeapp.service.MenuService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/menu")
public class MenuController {
    private final MenuService menuService;

    public MenuController(MenuService menuService) {
        this.menuService = menuService;
    }

    @GetMapping
    public List<MenuItemResponse> getMenuItems(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) List<String> exclude) {
        List<MenuItem> items;
        boolean hasExclude = exclude != null && !exclude.isEmpty();

        if (category != null && hasExclude) {
            items = menuService.getItemsByCategoryExcludingAllergens(category, exclude);
        } else if (category != null) {
            items = menuService.getItemsByCategory(category);
        } else if (hasExclude) {
            items = menuService.getItemsExcludingAllergens(exclude);
        } else {
            items = menuService.getAllAvailableItems();
        }

        return items.stream().map(MenuItemResponse::from).toList();
    }

    @GetMapping("/random")
    public ResponseEntity<MenuItemResponse> getRandomItem(
            @RequestParam String category,
            @RequestParam(required = false) List<String> exclude) {
        boolean hasExclude = exclude != null && !exclude.isEmpty();

        MenuItem item = hasExclude
            ? menuService.getRandomItemByCategoryExcludingAllergens(category, exclude)
            : menuService.getRandomItemByCategory(category);

        if (item == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(MenuItemResponse.from(item));
    }
}
