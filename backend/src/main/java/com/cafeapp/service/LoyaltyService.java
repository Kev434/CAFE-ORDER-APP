package com.cafeapp.service;

import com.cafeapp.entity.LoyaltyPoints;
import com.cafeapp.entity.Order;
import com.cafeapp.repository.LoyaltyPointsRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
public class LoyaltyService {
    private final LoyaltyPointsRepository loyaltyPointsRepository;

    public LoyaltyService(LoyaltyPointsRepository loyaltyPointsRepository) {
        this.loyaltyPointsRepository = loyaltyPointsRepository;
    }

    public void awardPoints(UUID userId, Order order) {
        int points = order.getTotal().intValue();
        LoyaltyPoints lp = new LoyaltyPoints();
        lp.setUserId(userId);
        lp.setPointsEarned(points);
        lp.setOrder(order);
        loyaltyPointsRepository.save(lp);
    }

    public int getBalance(UUID userId) {
        Integer sum = loyaltyPointsRepository.sumPointsByUserId(userId);
        return sum != null ? sum : 0;
    }

    public List<LoyaltyPoints> getHistory(UUID userId) {
        return loyaltyPointsRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
}
