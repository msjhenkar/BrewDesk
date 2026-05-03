package com.cafe.backend.service.Menu;

import com.cafe.backend.entities.MenuItem;
import com.cafe.backend.repository.MenuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MenuServiceImple implements MenuService {

    @Autowired
    private MenuRepository menuRepository;

    @Override
    public MenuItem createMenuItem(MenuItem menuItem) {
        return menuRepository.save(menuItem);
    }

    public List<MenuItem> getAllMenuItems() {
        return menuRepository.findAll();
    }


}
