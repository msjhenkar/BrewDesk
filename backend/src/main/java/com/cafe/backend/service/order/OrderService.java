package com.cafe.backend.service.order;

import com.cafe.backend.dtos.order.OrderRequestDTO;
import com.cafe.backend.dtos.order.OrderResponse;
import com.cafe.backend.entities.Order;

import java.util.List;

public interface OrderService {

    OrderResponse createOrder(OrderRequestDTO orderRequestDTO);

}
