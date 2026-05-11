package com.cafe.backend.service.order;

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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepo;
    @Autowired
    private MenuRepository menuRepo;
    @Autowired
    private UserRepository userRepo;

    @Override
    public OrderResponse createOrder(OrderRequestDTO request) {
        Order order = new Order();
        User user = userRepo.findById(request.getUserId())
                        .orElseThrow(() -> new RuntimeException("user not found"));

        order.setUser(user);
        order.setStatus(OrderStatus.PENDING);

        List<OrderItem> items = new ArrayList<>();

        BigDecimal totalAmount = BigDecimal.ZERO;

        for(OrderItemRequestDTO itemReq : request.getMenuItems()){

//            3. Look up the real Menu item in DB - validates it exists
            MenuItem menuItem = menuRepo
                    .findById(itemReq.getMenuItemId())
                    .orElseThrow(() -> new RuntimeException("menuItem not found: "+ itemReq.getMenuItemId()
                    ));

////             4. Check the item is actually available
//            if (!menuItem.isAvailable()) {
//                throw new RuntimeException(menuItem.getName() + " is not available");
//            }


//            4. Build the OrderItem - backend controls price and subtotal
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

        order.setOrderItems(items);
        order.setTotalAmount(totalAmount);

        Order saved = orderRepo.save(order);

//        return mapToResponse(saved);

        return null;
    }


}
