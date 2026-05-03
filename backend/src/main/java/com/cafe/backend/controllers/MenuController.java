package com.cafe.backend.controllers;

import com.cafe.backend.entities.MenuItem;
import com.cafe.backend.service.Menu.MenuService;
import com.cafe.backend.service.Menu.MenuServiceImple;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/menu")
public class MenuController {
    @Autowired
    private MenuServiceImple menuService;

    @PostMapping("/create")
    public ResponseEntity<MenuItem> createMenuItem(@RequestBody MenuItem menuItem){
        MenuItem savedItem = menuService.createMenuItem(menuItem);
        return new ResponseEntity<>(savedItem, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<MenuItem>> getAllMenuItems(){
        List<MenuItem> items = menuService.getAllMenuItems();
        return ResponseEntity.ok(items);
    }
}
