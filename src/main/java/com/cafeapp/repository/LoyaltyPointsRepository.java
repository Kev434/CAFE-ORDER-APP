package com.cafeapp.repository;

import com.cafeapp.entity.LoyaltyPoints;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.UUID;

public interface LoyaltyPointsRepository extends JpaRepository<LoyaltyPoints, UUID> {
    List<LoyaltyPoints> findByUserIdOrderByCreatedAtDesc(UUID userId);

    @Query("SELECT SUM(lp.pointsEarned) FROM LoyaltyPoints lp WHERE lp.userId = :userId")
    Integer sumPointsByUserId(UUID userId);
}
