package com.cafe.backend.service.Menu;

import com.cafe.backend.dtos.menu.MenuSearchRequest;
import com.cafe.backend.dtos.menu.MenuSearchResponse;
import com.cafe.backend.entities.MenuItem;

public interface MenuService {

    MenuItem createMenuItem(MenuItem menuItem);

    public MenuSearchResponse search(MenuSearchRequest request);
//    MenuItem findByName(String name);
}
