package com.cafe.backend.controllers;

import com.cafe.backend.dtos.menu.MenuSearchRequest;
import com.cafe.backend.dtos.menu.MenuSearchResponse;
import com.cafe.backend.entities.MenuItem;
import com.cafe.backend.service.menu.MenuServiceImple;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/api/menu")
public class MenuController {
    @Autowired
    private MenuServiceImple menuService;

    @PostMapping("/create")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MenuItem> createMenuItem(@RequestBody MenuItem menuItem){
        MenuItem savedItem = menuService.createMenuItem(menuItem);
        return new ResponseEntity<>(savedItem, HttpStatus.CREATED);
    }


    @GetMapping
    public ResponseEntity<List<MenuItem>> getAllMenuItems(@RequestParam(required = false, defaultValue = "1") int pageNo,
                                                          @RequestParam(required = false, defaultValue = "5") int pageSize,
                                                          @RequestParam(required = false, defaultValue = "id") String sortBy,
                                                          @RequestParam(required = false, defaultValue = "asc") String sortDir){

        Sort sort = null;
        if(sortDir.equalsIgnoreCase("asc")){
            sort = Sort.by(sortBy).ascending();
        }else{
            sort = Sort.by(sortBy).descending();
        }
        PageRequest pageRequest = PageRequest.of(pageNo-1, pageSize, sort);
        List<MenuItem> items = menuService.getAllMenuItems(pageRequest);
        return ResponseEntity.ok(items);
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<MenuItem> getMenuItemById(@PathVariable Long id){
        Optional<MenuItem> item = menuService.getMenuItemById(id);
        if(item.isPresent()){
            return ResponseEntity.ok(item.get());
        }
        else{
            return ResponseEntity.notFound().build(); //404 NOT FOUND
        }
    }

    @PostMapping("/search")
    public ResponseEntity<MenuSearchResponse> searchMenuItems(@RequestBody MenuSearchRequest request){
        MenuSearchResponse response = menuService.search(request);

        if(response.getTotalCount() == 0){
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(response);
            // 204 No Content — search worked but nothing found
        }
        return ResponseEntity.ok(response);
    }

    // 🔍 GET-based quick search (just a keyword in URL)
// GET /menu/search?keyword=choc
    @GetMapping("/search")
    public ResponseEntity<MenuSearchResponse> quickSearch(@RequestParam String keyword){
        MenuSearchRequest request = new MenuSearchRequest();
        request.setKeyword(keyword);

        return ResponseEntity.ok(menuService.search(request));
    }

    @PutMapping("/update/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MenuItem> updateMenuItem(@PathVariable Long id, @RequestBody MenuItem menuItem){
        MenuItem updated = menuService.updateMenuItem(id, menuItem);
        return ResponseEntity.ok(updated);
    }
}