package com.cafeapp.service;

import com.cafeapp.entity.Allergen;
import com.cafeapp.entity.MenuItem;
import com.cafeapp.repository.MenuItemRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MenuServiceTest {

    @Mock
    private MenuItemRepository menuItemRepository;

    @InjectMocks
    private MenuService menuService;

    private Allergen createAllergen(String name) {
        Allergen allergen = new Allergen();
        allergen.setId(UUID.randomUUID());
        allergen.setName(name);
        return allergen;
    }

    private MenuItem createItemWithAllergens(String name, String category, String... allergenNames) {
        MenuItem item = createItem(name, category);
        Set<Allergen> allergens = new HashSet<>();
        for (String allergenName : allergenNames) {
            allergens.add(createAllergen(allergenName));
        }
        item.setAllergens(allergens);
        return item;
    }

    private MenuItem createItem(String name, String category) {
        MenuItem item = new MenuItem();
        item.setId(UUID.randomUUID());
        item.setName(name);
        item.setCategory(category);
        item.setPrice(BigDecimal.valueOf(4.50));
        item.setAvailable(true);
        return item;
    }

    @Test
    void getAllAvailableItems_returnsOnlyAvailable() {
        MenuItem available = createItem("Latte", "espresso");
        when(menuItemRepository.findByAvailableTrue()).thenReturn(List.of(available));
        List<MenuItem> result = menuService.getAllAvailableItems();
        assertEquals(1, result.size());
        assertEquals("Latte", result.get(0).getName());
    }

    @Test
    void getItemsByCategory_filtersCorrectly() {
        MenuItem coffee = createItem("House Blend", "coffee");
        when(menuItemRepository.findByCategoryAndAvailableTrue("coffee")).thenReturn(List.of(coffee));
        List<MenuItem> result = menuService.getItemsByCategory("coffee");
        assertEquals(1, result.size());
        assertEquals("coffee", result.get(0).getCategory());
    }

    @Test
    void getRandomItem_returnsSingleItem() {
        MenuItem item1 = createItem("Latte", "espresso");
        MenuItem item2 = createItem("Cappuccino", "espresso");
        when(menuItemRepository.findByCategoryAndAvailableTrue("espresso")).thenReturn(List.of(item1, item2));
        MenuItem result = menuService.getRandomItemByCategory("espresso");
        assertNotNull(result);
        assertEquals("espresso", result.getCategory());
    }

    @Test
    void getRandomItem_emptyCategory_returnsNull() {
        when(menuItemRepository.findByCategoryAndAvailableTrue("tea")).thenReturn(List.of());
        MenuItem result = menuService.getRandomItemByCategory("tea");
        assertNull(result);
    }

    @Test
    void getItemsExcludingAllergens_filtersCorrectly() {
        MenuItem americano = createItemWithAllergens("Americano", "espresso");
        when(menuItemRepository.findAvailableExcludingAllergens(List.of("dairy")))
            .thenReturn(List.of(americano));
        List<MenuItem> result = menuService.getItemsExcludingAllergens(List.of("dairy"));
        assertEquals(1, result.size());
        assertEquals("Americano", result.get(0).getName());
    }

    @Test
    void getRandomItemExcludingAllergens_respectsExclusions() {
        MenuItem americano = createItemWithAllergens("Americano", "espresso");
        when(menuItemRepository.findByCategoryExcludingAllergens("espresso", List.of("dairy")))
            .thenReturn(List.of(americano));
        MenuItem result = menuService.getRandomItemByCategoryExcludingAllergens("espresso", List.of("dairy"));
        assertNotNull(result);
        assertEquals("Americano", result.getName());
    }
}
