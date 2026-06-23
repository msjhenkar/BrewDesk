package com.cafe.backend.service.order;

import com.cafe.backend.dtos.order.OrderItemResponse;
import com.cafe.backend.dtos.order.OrderRequestDTO;
import com.cafe.backend.dtos.order.OrderItemRequestDTO;
import com.cafe.backend.dtos.order.OrderResponse;
import com.cafe.backend.entities.MenuItem;
import com.cafe.backend.entities.Order;
import com.cafe.backend.entities.OrderItem;
import com.cafe.backend.entities.User;
import com.cafe.backend.enums.OrderStatus;
import com.cafe.backend.repository.MenuRepository;
import com.cafe.backend.repository.OrderRepository;
import com.cafe.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepo;
    @Autowired
    private MenuRepository menuRepo;
    @Autowired
    private UserRepository userRepo;

    @Override
    public OrderResponse createOrder(OrderRequestDTO request) {
        //1. Create the parent Order (no items yet)
        Order order = new Order();
        User user = userRepo.findById(request.getUserId())
                        .orElseThrow(() -> new RuntimeException("user not found"));

        order.setUser(user);
        order.setStatus(OrderStatus.PENDING);

        // 2. Process each item the frontend sent
        List<OrderItem> items = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        for(OrderItemRequestDTO itemReq : request.getMenuItems()){

            // 3. Look up the real Menu item in DB - validates it exists
            MenuItem menuItem = menuRepo
                    .findById(itemReq.getMenuItemId())
                    .orElseThrow(() -> new RuntimeException("menuItem not found: "+ itemReq.getMenuItemId()
                    ));

////             4. Check the item is actually available
//            if (!menuItem.isAvailable()) {
//                throw new RuntimeException(menuItem.getName() + " is not available");
//            }


//            5. Build the OrderItem - backend controls price and subtotal
            OrderItem item = new OrderItem();
            item.setMenuItem(menuItem);
            item.setQuantity(itemReq.getQuantity());
            BigDecimal price = BigDecimal.valueOf(menuItem.getPrice());

            item.setPrice(price);
            item.setSubtotal(
                        price
                            .multiply(BigDecimal.valueOf(
                                    itemReq.getQuantity()
                            ))
            );

            item.setOrder(order);

            items.add(item);
            totalAmount = totalAmount.add(item.getSubtotal());

        }

        // 6. Set computed values on the order

        order.setOrderItems(items);
        order.setTotalAmount(totalAmount);

        // 7. Save - cascadeType.ALL
        Order saved = orderRepo.save(order);

        return mapToResponse(saved);

    }

    @Override
    public OrderResponse updateStatus(Long orderId, OrderStatus newStatus) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("order not found: "+ orderId));

        validateStatusTransition(order.getStatus(),newStatus);

        order.setStatus(newStatus);
        return mapToResponse(orderRepo.save(order));
    }


    // GET all Orders
    @Override
    public List<OrderResponse> getAllOrders() {
       List<Order> orders = orderRepo.findAll();

       List<OrderResponse> responses = new ArrayList<>();

       for(Order order : orders){
           OrderResponse res =  mapToResponse(order);
           responses.add(res);
       }
       return responses;
    }

    // GET Order by ID
    @Override
    public OrderResponse getOrderById(Long orderId) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("order not found: "+ orderId));
        return mapToResponse(order);
    }

    //delete Order
    @Override
    public void deleteOrder(Long orderId){
        if(!orderRepo.existsById(orderId)){
            throw new RuntimeException("order not found: "+ orderId);

        }
        orderRepo.deleteById(orderId);
    }

    @Override
    public List<OrderResponse> getOrdersByUserId(Long userId) {
        List<Order> orders = orderRepo.findByUserId(userId);
        List<OrderResponse> responses = new ArrayList<>();
        for (Order order : orders) {
            responses.add(mapToResponse(order));
        }
        return responses;
    }

    private void validateStatusTransition(OrderStatus current, OrderStatus next){
        if(current == OrderStatus.CANCELLED || current == OrderStatus.COMPLETED){
            throw new RuntimeException("order status can't be changed from "+ current);
        }

        if(current == OrderStatus.PENDING && next == OrderStatus.COMPLETED){
            throw new RuntimeException("Invalid transition: "+ current + "->" + next);
        }
    }

    private OrderResponse mapToResponse(Order order) {
        OrderResponse resp = new OrderResponse();

        resp.setOrderId(order.getOrderId());
        resp.setUserId(order.getUser().getId());

        resp.setUserName(
                order.getUser().getFirstName()
                        + (
                        order.getUser().getLastName() != null ? " " + order.getUser().getLastName() : ""
                )
        );
        resp.setTotalAmount(order.getTotalAmount());
        resp.setCreatedAt(order.getCreatedAt());
        resp.setStatus(order.getStatus().name());

        List<OrderItemResponse> itemResponses = order.getOrderItems().stream()
                .map(item -> {
                    OrderItemResponse ir = new OrderItemResponse();
                    ir.setOrderItemId(item.getOrderItemId());
                    ir.setMenuItemName(item.getMenuItem().getItemName());
                    ir.setQuantity(item.getQuantity());
                    ir.setPrice(item.getPrice());
                    ir.setSubTotal(item.getSubtotal());

                    return ir;
                })
                .collect(Collectors.toList());


        resp.setItems(itemResponses);
        return resp;
    }


}
