package com.cafeapp.repository;

import com.cafeapp.entity.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.UUID;

public interface MenuItemRepository extends JpaRepository<MenuItem, UUID> {
    List<MenuItem> findByAvailableTrue();
    List<MenuItem> findByCategoryAndAvailableTrue(String category);

    @Query("SELECT DISTINCT m FROM MenuItem m LEFT JOIN FETCH m.allergens WHERE m.available = true")
    List<MenuItem> findAvailableWithAllergens();

    @Query("SELECT DISTINCT m FROM MenuItem m LEFT JOIN FETCH m.allergens WHERE m.available = true AND m.category = :category")
    List<MenuItem> findByCategoryWithAllergens(@Param("category") String category);

    @Query("SELECT DISTINCT m FROM MenuItem m LEFT JOIN FETCH m.allergens WHERE m.available = true AND NOT EXISTS (SELECT 1 FROM m.allergens a WHERE a.name IN :excluded)")
    List<MenuItem> findAvailableExcludingAllergens(@Param("excluded") List<String> excluded);

    @Query("SELECT DISTINCT m FROM MenuItem m LEFT JOIN FETCH m.allergens WHERE m.available = true AND m.category = :category AND NOT EXISTS (SELECT 1 FROM m.allergens a WHERE a.name IN :excluded)")
    List<MenuItem> findByCategoryExcludingAllergens(@Param("category") String category, @Param("excluded") List<String> excluded);
}
