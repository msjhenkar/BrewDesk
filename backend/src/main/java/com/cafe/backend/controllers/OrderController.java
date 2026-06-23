package com.cafe.backend.controllers;

import com.cafe.backend.dtos.order.OrderRequestDTO;
import com.cafe.backend.dtos.order.OrderResponse;
import com.cafe.backend.entities.User;
import com.cafe.backend.enums.OrderStatus;
import com.cafe.backend.enums.UserRole;
import com.cafe.backend.security.CustomUserDetails;
import com.cafe.backend.service.order.OrderService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
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
    @PreAuthorize("isAuthenticated()")
    public OrderResponse createOrder(@RequestBody @Validated OrderRequestDTO requestDTO){
        return orderService.createOrder(requestDTO);
    }



    @PatchMapping("/{id}/status")
    public OrderResponse updateStatus(
            @PathVariable Long id,
            @RequestParam OrderStatus status,
            Authentication authentication) {

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User currentUser = userDetails.getUser();

        OrderResponse order = orderService.getOrderById(id);

        boolean isOwner = order.getUserId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == UserRole.ADMIN;

        if (!isAdmin && !isOwner) {
            throw new AccessDeniedException("You don't have permission to modify this order");
        }

        if (!isAdmin) {
            // Customers may only cancel their own order
            if (status != OrderStatus.CANCELLED) {
                throw new AccessDeniedException("Only staff can set this status");
            }
            // Can't cancel something already finished
            if (OrderStatus.valueOf(order.getStatus()) == OrderStatus.COMPLETED) {
                throw new IllegalStateException("Cannot cancel a completed order");
            }
        }

        return orderService.updateStatus(id, status);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteOrder(@PathVariable  Long id){
        orderService.deleteOrder(id);
    }


    @GetMapping
    public ResponseEntity<List<OrderResponse>> getAllOrders(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User currentUser = userDetails.getUser();

        List<OrderResponse> orders;
        if (currentUser.getRole() == UserRole.ADMIN) {
            orders = orderService.getAllOrders();
        } else {
            orders = orderService.getOrdersByUserId(currentUser.getId());
        }
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Long id, Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User currentUser = userDetails.getUser();

        OrderResponse order = orderService.getOrderById(id);

        boolean isOwner = order.getUserId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == UserRole.ADMIN;

        if (!isOwner && !isAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(order);
    }
}
