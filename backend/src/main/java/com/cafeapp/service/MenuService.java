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
        return menuItemRepository.findAvailableWithAllergens();
    }

    public List<MenuItem> getItemsByCategory(String category) {
        return menuItemRepository.findByCategoryWithAllergens(category);
    }

    public MenuItem getRandomItemByCategory(String category) {
        List<MenuItem> items = menuItemRepository.findByCategoryWithAllergens(category);
        if (items.isEmpty()) return null;
        int index = ThreadLocalRandom.current().nextInt(items.size());
        return items.get(index);
    }

    public List<MenuItem> getItemsExcludingAllergens(List<String> excluded) {
        return menuItemRepository.findAvailableExcludingAllergens(excluded);
    }

    public List<MenuItem> getItemsByCategoryExcludingAllergens(String category, List<String> excluded) {
        return menuItemRepository.findByCategoryExcludingAllergens(category, excluded);
    }

    public MenuItem getRandomItemByCategoryExcludingAllergens(String category, List<String> excluded) {
        List<MenuItem> items = menuItemRepository.findByCategoryExcludingAllergens(category, excluded);
        if (items.isEmpty()) return null;
        int index = ThreadLocalRandom.current().nextInt(items.size());
        return items.get(index);
    }
}
