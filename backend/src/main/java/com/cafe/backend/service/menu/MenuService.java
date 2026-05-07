package com.cafe.backend.service.menu;

import com.cafe.backend.dtos.menu.MenuSearchRequest;
import com.cafe.backend.dtos.menu.MenuSearchResponse;
import com.cafe.backend.entities.MenuItem;

public interface MenuService {

    MenuItem createMenuItem(MenuItem menuItem);

    MenuSearchResponse search(MenuSearchRequest request);
//    MenuItem findByName(String name);

    MenuItem updateMenuItem(Long id, MenuItem updatedItem);
}
