package com.cafeapp.service;

import com.cafeapp.entity.LoyaltyPoints;
import com.cafeapp.entity.Order;
import com.cafeapp.repository.LoyaltyPointsRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.math.BigDecimal;
import java.util.UUID;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LoyaltyServiceTest {

    @Mock private LoyaltyPointsRepository loyaltyPointsRepository;
    @InjectMocks private LoyaltyService loyaltyService;

    @Test
    void awardPoints_calculatesOnePointPerDollar() {
        UUID userId = UUID.randomUUID();
        Order order = new Order();
        order.setTotal(BigDecimal.valueOf(12.75));
        when(loyaltyPointsRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        loyaltyService.awardPoints(userId, order);

        verify(loyaltyPointsRepository).save(argThat(lp ->
            lp.getPointsEarned() == 12 && lp.getUserId().equals(userId)
        ));
    }

    @Test
    void getBalance_sumsAllPoints() {
        UUID userId = UUID.randomUUID();
        when(loyaltyPointsRepository.sumPointsByUserId(userId)).thenReturn(42);
        int balance = loyaltyService.getBalance(userId);
        assertEquals(42, balance);
    }

    @Test
    void getBalance_noPoints_returnsZero() {
        UUID userId = UUID.randomUUID();
        when(loyaltyPointsRepository.sumPointsByUserId(userId)).thenReturn(null);
        int balance = loyaltyService.getBalance(userId);
        assertEquals(0, balance);
    }
}
