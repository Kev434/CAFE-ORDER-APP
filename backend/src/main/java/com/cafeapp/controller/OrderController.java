package com.cafeapp.controller;

import com.cafeapp.dto.CreateOrderRequest;
import com.cafeapp.dto.OrderResponse;
import com.cafeapp.entity.Order;
import com.cafeapp.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        Order order = orderService.createOrder(request);
        return ResponseEntity.ok(OrderResponse.from(order));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrder(@PathVariable UUID id) {
        Order order = orderService.getOrderById(id);
        if (order == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(OrderResponse.from(order));
    }

    @GetMapping
    public List<OrderResponse> getMyOrders(@AuthenticationPrincipal Jwt jwt) {
        UUID userId = UUID.fromString(jwt.getSubject());
        return orderService.getOrdersByUserId(userId).stream()
            .map(OrderResponse::from).toList();
    }
}
