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
    public List<MenuItemResponse> getMenuItems(@RequestParam(required = false) String category) {
        List<MenuItem> items = (category != null)
            ? menuService.getItemsByCategory(category)
            : menuService.getAllAvailableItems();
        return items.stream().map(MenuItemResponse::from).toList();
    }

    @GetMapping("/random")
    public ResponseEntity<MenuItemResponse> getRandomItem(@RequestParam String category) {
        MenuItem item = menuService.getRandomItemByCategory(category);
        if (item == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(MenuItemResponse.from(item));
    }
}
