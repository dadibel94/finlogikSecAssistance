package com.finlogic.fincode.repository;

import com.finlogic.fincode.entities.GroupQuestion;
import com.finlogic.fincode.entities.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GroupQuestionRepository extends JpaRepository<GroupQuestion, Long> {
}