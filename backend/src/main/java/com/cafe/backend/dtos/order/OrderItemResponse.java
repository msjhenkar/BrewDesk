package com.cafe.backend.dtos.order;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class OrderItemResponse {

    private Long orderItemId;

    private String menuItemName;

    private Integer quantity;

    private BigDecimal price;

    private BigDecimal subTotal;


}
