package com.cafe.backend.dtos.order;

import lombok.Data;

import java.util.List;

@Data
public class OrderRequestDTO {
    private Long userId;

    private List<OrderItemRequestDTO> menuItems;
}
