package com.finlogic.fincode.controllers;

import com.finlogic.fincode.entities.ReponseQuestion;
import com.finlogic.fincode.entities.Utilisateur;
import com.finlogic.fincode.services.ReponseQuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reponses")
@RequiredArgsConstructor
public class ReponseQuestionController {

    private final ReponseQuestionService reponseQuestionService;

    @GetMapping
    public List<ReponseQuestion> getAllReponses() {
        return reponseQuestionService.getAllReponses();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReponseQuestion> getReponseById(@PathVariable Long id) {
        Optional<ReponseQuestion> reponse = reponseQuestionService.getReponseById(id);
        return reponse.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ReponseQuestion> createReponse(@RequestBody ReponseQuestion reponse) {
        ReponseQuestion savedReponse = reponseQuestionService.createReponse(reponse);
        return ResponseEntity.ok(savedReponse);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReponseQuestion> updateReponse(@PathVariable Long id, @RequestBody ReponseQuestion updatedReponse) {
        Optional<ReponseQuestion> reponse = reponseQuestionService.updateReponse(id, updatedReponse);
        return reponse.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReponse(@PathVariable Long id) {
        reponseQuestionService.deleteReponse(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/assign-user/{userId}")
    public ResponseEntity<ReponseQuestion> assignUserToReponse(@PathVariable Long id, @PathVariable Long userId) {
        Optional<ReponseQuestion> reponse = reponseQuestionService.assignUserToReponse(id, userId);
        return reponse.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
