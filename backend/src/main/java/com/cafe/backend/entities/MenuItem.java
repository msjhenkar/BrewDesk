package com.cafe.backend.entities;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class MenuItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String itemName;

    private String description;

    @Column(nullable = false)
    private Double price;

    private String category;

}
