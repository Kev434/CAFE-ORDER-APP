package com.cafeapp.service;

import com.cafeapp.entity.MenuItem;
import com.cafeapp.repository.MenuItemRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class MenuService {
    private final MenuItemRepository menuItemRepository;

    public MenuService(MenuItemRepository menuItemRepository) {
        this.menuItemRepository = menuItemRepository;
    }

    public List<MenuItem> getAllAvailableItems() {
        return menuItemRepository.findByAvailableTrue();
    }

    public List<MenuItem> getItemsByCategory(String category) {
        return menuItemRepository.findByCategoryAndAvailableTrue(category);
    }

    public MenuItem getRandomItemByCategory(String category) {
        List<MenuItem> items = menuItemRepository.findByCategoryAndAvailableTrue(category);
        if (items.isEmpty()) return null;
        int index = ThreadLocalRandom.current().nextInt(items.size());
        return items.get(index);
    }
}
