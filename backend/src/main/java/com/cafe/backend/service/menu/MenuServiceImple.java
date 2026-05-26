package com.cafe.backend.service.menu;

import com.cafe.backend.dtos.menu.MenuSearchRequest;
import com.cafe.backend.dtos.menu.MenuSearchResponse;
import com.cafe.backend.entities.MenuItem;
import com.cafe.backend.repository.MenuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MenuServiceImple implements MenuService {

    @Autowired
    private MenuRepository menuRepository;

    @Override
    public MenuItem createMenuItem(MenuItem menuItem) {
        return menuRepository.save(menuItem);
    }

    public List<MenuItem> getAllMenuItems(Pageable pageable) {
        return menuRepository.findAll(pageable).getContent();
    }

    public Optional<MenuItem> getMenuItemById(Long id){
        return menuRepository.findById(id);
    }

    @Override
    public MenuSearchResponse search(MenuSearchRequest request){
        List<MenuItem> results = List.of();
        String keyword = request.getKeyword();

        //CASE 1: No keyword + No Category + return all
        if((keyword==null || keyword.isBlank()) && request.getCategory() == null){
            results = menuRepository.findAll();
        }
        else if(keyword!=null && !keyword.isBlank() && request.getCategory() != null){
            results = menuRepository.searchByKeywordAndCategory(keyword,request.getCategory());
        }

        else if (keyword !=  null && !keyword.isBlank()) {
            results = menuRepository.searchByKeyword(keyword);
        }

        //Applying Price Filter by money
        if(request.getMinPrice()!=null){
            results = results.stream()
                    .filter(item -> item.getPrice() >= request.getMinPrice())
                    .toList();

        }

        if(request.getMaxPrice()!=null){
            results = results.stream()
                    .filter(item -> item.getPrice() <= request.getMaxPrice())
                    .toList();
        }

        return new MenuSearchResponse(results, keyword);

    }

/*      ----------------------------------------
        UPDATE OPERATION
        1) Look up the item by ID in the DataBase
        2) If not found -> throw an exception (item doesn't exist, can't update)
        3) If found -> overwrite its fields with new values from request
        4) save the updated item back to the database
        5) Return the saved item.

*/


    @Override
    public MenuItem updateMenuItem(Long id, MenuItem updatedItem) {

        //step 1: Find Existing item
        MenuItem existingItem = menuRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(("Menu Item not found!")));

        //step 2:
        existingItem.setItemName(updatedItem.getItemName());
        existingItem.setPrice(updatedItem.getPrice());
        existingItem.setCategory(updatedItem.getCategory());
        existingItem.setDescription(updatedItem.getDescription());
        return menuRepository.save(existingItem);

    }

}