package com.cafe.backend.service.Menu;

import com.cafe.backend.dtos.menu.MenuSearchRequest;
import com.cafe.backend.dtos.menu.MenuSearchResponse;
import com.cafe.backend.entities.MenuItem;
import com.cafe.backend.repository.MenuRepository;
import org.springframework.beans.factory.annotation.Autowired;
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

    public List<MenuItem> getAllMenuItems() {
        return menuRepository.findAll();
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

}
