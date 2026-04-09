package com.cafeapp.service;

import com.cafeapp.dto.CreateOrderRequest;
import com.cafeapp.entity.MenuItem;
import com.cafeapp.entity.Order;
import com.cafeapp.repository.MenuItemRepository;
import com.cafeapp.repository.OrderRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock private OrderRepository orderRepository;
    @Mock private MenuItemRepository menuItemRepository;
    @Mock private LoyaltyService loyaltyService;
    @InjectMocks private OrderService orderService;

    @Test
    void createGuestOrder_setsGuestName() {
        MenuItem item = new MenuItem();
        item.setId(UUID.randomUUID());
        item.setPrice(BigDecimal.valueOf(5.00));
        when(menuItemRepository.findById(any())).thenReturn(Optional.of(item));
        when(orderRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        CreateOrderRequest request = new CreateOrderRequest(
            null, "Alice",
            List.of(new CreateOrderRequest.OrderItemRequest(item.getId(), 2, false))
        );

        Order order = orderService.createOrder(request);

        assertEquals("Alice", order.getGuestName());
        assertNull(order.getUserId());
        assertEquals(0, BigDecimal.valueOf(10.00).compareTo(order.getTotal()));
    }

    @Test
    void createAuthenticatedOrder_setsUserId() {
        UUID userId = UUID.randomUUID();
        MenuItem item = new MenuItem();
        item.setId(UUID.randomUUID());
        item.setPrice(BigDecimal.valueOf(4.50));
        when(menuItemRepository.findById(any())).thenReturn(Optional.of(item));
        when(orderRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        CreateOrderRequest request = new CreateOrderRequest(
            userId, null,
            List.of(new CreateOrderRequest.OrderItemRequest(item.getId(), 1, false))
        );

        Order order = orderService.createOrder(request);

        assertEquals(userId, order.getUserId());
        assertNull(order.getGuestName());
    }
}
