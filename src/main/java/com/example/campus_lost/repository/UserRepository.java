package com.example.campus_lost.repository;

import com.example.campus_lost.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}