package com.finlogic.fincode.controllers;

import com.finlogic.fincode.entities.GroupQuestion;
import com.finlogic.fincode.entities.ReponseQuestion;
import com.finlogic.fincode.entities.Utilisateur;
import com.finlogic.fincode.services.GroupQuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
public class GroupQuestionController {

    private final GroupQuestionService groupQuestionService;

    @GetMapping
    public List<GroupQuestion> getAllGroupQuestions() {
        return groupQuestionService.getAllGroupQuestions();
    }

    @GetMapping("/{id}")
    public ResponseEntity<GroupQuestion> getGroupQuestionById(@PathVariable Long id) {
        Optional<GroupQuestion> groupQuestion = groupQuestionService.getGroupQuestionById(id);
        return groupQuestion.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<GroupQuestion> createGroupQuestion(@RequestBody GroupQuestion groupQuestion) {
        // Ensure utilisateurs and reponses are initialized as empty lists if not provided
        if (groupQuestion.getUtilisateurs() == null) {
            groupQuestion.setUtilisateurs(new ArrayList<>());
        }
        if (groupQuestion.getReponses() == null) {
            groupQuestion.setReponses(new ArrayList<>());
        }

        GroupQuestion savedGroup = groupQuestionService.createGroupQuestion(groupQuestion);
        return ResponseEntity.ok(savedGroup);
    }

    @PutMapping("/{id}")
    public ResponseEntity<GroupQuestion> updateGroupQuestion(@PathVariable Long id, @RequestBody GroupQuestion updatedGroup) {
        Optional<GroupQuestion> groupQuestion = groupQuestionService.updateGroupQuestion(id, updatedGroup);
        return groupQuestion.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGroupQuestion(@PathVariable Long id) {
        groupQuestionService.deleteGroupQuestion(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/add-user/{userId}")
    public ResponseEntity<GroupQuestion> addUserToGroup(@PathVariable Long id, @PathVariable Long userId) {
        Optional<GroupQuestion> groupQuestion = groupQuestionService.addUserToGroup(id, userId);
        return groupQuestion.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/add-response")
    public ResponseEntity<GroupQuestion> addResponseToGroup(@PathVariable Long id, @RequestBody ReponseQuestion response) {
        Optional<GroupQuestion> groupQuestion = groupQuestionService.addResponseToGroup(id, response);
        return groupQuestion.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
