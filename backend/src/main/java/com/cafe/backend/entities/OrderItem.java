//package com.cafe.backend.entities;
//
//import jakarta.persistence.*;
//import lombok.Data;
//
//@Entity
//@Data
//public class OrderItem {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long orderItemId;
//
//    @ManyToMany
//    @JoinColumn(name = "item_id")
//    private MenuItem menuItem;
//
//    @ManyToOne
//    private Order order;
//
//    private Integer quantity;
//
//    private Double price;
//
//    private Double subtotal;
//}
