package com.cafe.backend.entities;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;

@Entity
@Data
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderItemId;

    @ManyToOne
    @JoinColumn(name = "item_id")
    private MenuItem menuItem;

    @ManyToOne
    @JoinColumn(name="order_id")
    private Order order;

    private Integer quantity;

    private BigDecimal price;

    private BigDecimal subtotal;
}
