package com.example.campus_lost.repository;

import com.example.campus_lost.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}