package com.cafe.backend.dtos.menu;

import lombok.Data;

@Data
public class MenuSearchRequest {
    private String keyword;     //what user typed in search bar
    private String category;    //Optional category filter
    private Double minPrice;    //price range
    private Double maxPrice;


}
