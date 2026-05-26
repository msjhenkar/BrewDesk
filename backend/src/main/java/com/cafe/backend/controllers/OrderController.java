package com.cafe.backend.controllers;

import com.cafe.backend.dtos.order.OrderRequestDTO;
import com.cafe.backend.dtos.order.OrderResponse;
import com.cafe.backend.enums.OrderStatus;
import com.cafe.backend.service.order.OrderService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse createOrder(@RequestBody @Validated OrderRequestDTO requestDTO){
        return orderService.createOrder(requestDTO);
    }

    //get All order
    @GetMapping
    public List<OrderResponse> getAllOrders(){
        return orderService.getAllOrders();
    }

    @GetMapping("/{id}")
    public OrderResponse getOrderById(@PathVariable  Long id){
        return orderService.getOrderById(id);
    }

    @PatchMapping("/{id}/status")
    public OrderResponse updateStatus(
            @PathVariable  Long id,
            @RequestParam OrderStatus status
    ){
        return orderService.updateStatus(id, status);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteOrder(@PathVariable  Long id){
        orderService.deleteOrder(id);
    }
}
