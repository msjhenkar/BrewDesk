package com.cafe.backend.controllers;

import com.cafe.backend.dtos.order.OrderResponse;
import com.cafe.backend.entities.Order;
import com.cafe.backend.enums.OrderStatus;
import com.cafe.backend.service.order.OrderService;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/orders")
public class AdminOrderController {

    @Autowired
    private OrderService orderService;

//    Get All Orders
    @GetMapping
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        return ResponseEntity.ok(
                orderService.getAllOrders()
        );
    }

    @GetMapping("/{id}")

    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Long id){
        return ResponseEntity.ok(
                orderService.getOrderById(id)
        );
    }


    @PutMapping("/{id}/status")
    public ResponseEntity<OrderResponse> updateOrderStauts(@PathVariable Long id, @RequestParam OrderStatus orderStatus){
        return ResponseEntity.ok(
                orderService.updateStatus(id, orderStatus)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.ok(
                "Order deleted successfully"
        );

    }
}
