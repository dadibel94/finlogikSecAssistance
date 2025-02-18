package com.finlogic.fincode.repository;

import com.finlogic.fincode.entities.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {
    boolean existsByEmail(String email);

    Optional<Utilisateur> findByEmail(String email);
}
