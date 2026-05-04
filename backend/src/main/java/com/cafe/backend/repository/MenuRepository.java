package com.cafe.backend.repository;

import com.cafe.backend.entities.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MenuRepository extends JpaRepository<MenuItem, Long> {

    MenuItem findByCategory(String category);

    //search across MULTIPLE fields at once
    @Query("SELECT m FROM MenuItem m WHERE " +
            "LOWER(m.itemName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(m.category) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<MenuItem> searchByKeyword(@Param("keyword") String keyword);

    //search with category FILTER + keyword Together
    @Query("SELECT m FROM MenuItem m WHERE " +
    "m.category = :category AND (" +
    "LOWER(m.itemName) LIKE LOWER(CONCAT('%', :keyword, '%')))  ")
    List<MenuItem> searchByKeywordAndCategory(
            @Param("keyword") String keyword,
            @Param("category") String category
    );
}
