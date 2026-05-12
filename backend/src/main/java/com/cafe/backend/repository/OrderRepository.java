package com.cafe.backend.repository;

import com.cafe.backend.entities.Order;
import com.cafe.backend.entities.OrderItem;
import com.cafe.backend.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    // save(), findById(), findAll(), deleteById(), existsById()

    //Custom query for "get all orders by User"
    List<Order> findByUserId(Long userId);


    List<OrderItem> findByStatus(OrderStatus status);
}
