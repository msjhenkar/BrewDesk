package com.cafe.backend.dtos.menu;

import com.cafe.backend.entities.MenuItem;
import lombok.Data;

import java.util.List;

@Data
public class MenuSearchResponse {

    private List<MenuItem> result;
    private int totalCount;

    public MenuSearchResponse(List<MenuItem> result,String searchedFor) {
        this.result = result;
        this.totalCount = result.size();
    }

}
