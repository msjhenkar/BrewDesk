package com.cafe.backend.service.order;

import com.cafe.backend.dtos.order.OrderRequestDTO;
import com.cafe.backend.dtos.order.OrderResponse;
import com.cafe.backend.entities.Order;
import com.cafe.backend.enums.OrderStatus;

import java.util.List;

public interface OrderService {

    OrderResponse createOrder(OrderRequestDTO orderRequestDTO);

    OrderResponse updateStatus(Long  orderId, OrderStatus orderStatus);

    List<OrderResponse> getAllOrders();

    OrderResponse getOrderById(Long orderId);

    void deleteOrder(Long orderId);
}
