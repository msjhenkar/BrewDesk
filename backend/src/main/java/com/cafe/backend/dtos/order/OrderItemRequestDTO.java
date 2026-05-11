package com.cafe.backend.dtos.order;

import lombok.Data;

@Data
public class OrderItemRequestDTO {

    private Long menuItemId;

    private Integer quantity;

}
