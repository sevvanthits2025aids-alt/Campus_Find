package com.example.campus_lost.repository;

import com.example.campus_lost.entity.LostReport;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LostReportRepository extends JpaRepository<LostReport, Long> {
}