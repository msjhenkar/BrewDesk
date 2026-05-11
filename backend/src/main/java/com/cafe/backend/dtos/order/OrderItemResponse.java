package com.cafe.backend.dtos.order;

import java.math.BigDecimal;

public class OrderItemResponse {

    private Long orderItemId;

    private String menuItemName;

    private Integer quantity;

    private BigDecimal price;

    private BigDecimal subTotal;


}
