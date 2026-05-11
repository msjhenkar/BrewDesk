package com.cafe.backend.dtos.order;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class OrderResponse {
    private Long orderId;
    private Long userId;
    private String userName;
    private BigDecimal totalAmount;
    private String status;
    private LocalDateTime createdAt;
    private List<OrderItemRequestDTO> items;
}
