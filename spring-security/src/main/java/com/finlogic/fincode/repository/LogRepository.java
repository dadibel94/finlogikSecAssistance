package com.finlogic.fincode.repository;

import com.finlogic.fincode.entities.Log;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LogRepository extends JpaRepository<Log, Long> {
    List<Log> findByUtilisateurId(Long userId);
}
