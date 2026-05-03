package com.cafe.backend.repository;

import com.cafe.backend.entities.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MenuRepository extends JpaRepository<MenuItem, Long> {
}
