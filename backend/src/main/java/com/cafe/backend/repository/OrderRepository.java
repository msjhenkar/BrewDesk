package com.cafe.backend.repository;

import com.cafe.backend.entities.Order;
import com.cafe.backend.entities.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {

}
