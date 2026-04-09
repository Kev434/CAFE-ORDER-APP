package com.cafeapp.repository;

import com.cafeapp.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface OrderItemRepository extends JpaRepository<OrderItem, UUID> {}
