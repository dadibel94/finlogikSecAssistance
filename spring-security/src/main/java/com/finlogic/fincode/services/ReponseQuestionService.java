package com.finlogic.fincode.services;

import com.finlogic.fincode.entities.ReponseQuestion;
import com.finlogic.fincode.entities.Utilisateur;
import com.finlogic.fincode.repository.ReponseQuestionRepository;
import com.finlogic.fincode.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReponseQuestionService {

    private final ReponseQuestionRepository reponseQuestionRepository;
    private final UtilisateurRepository utilisateurRepository;

    public List<ReponseQuestion> getAllReponses() {
        return reponseQuestionRepository.findAll();
    }

    public Optional<ReponseQuestion> getReponseById(Long id) {
        return reponseQuestionRepository.findById(id);
    }

    public ReponseQuestion createReponse(ReponseQuestion reponse) {
        return reponseQuestionRepository.save(reponse);
    }

    public Optional<ReponseQuestion> updateReponse(Long id, ReponseQuestion updatedReponse) {
        return reponseQuestionRepository.findById(id).map(existingReponse -> {
            existingReponse.setReponse(updatedReponse.getReponse());
            return reponseQuestionRepository.save(existingReponse);
        });
    }

    public void deleteReponse(Long id) {
        reponseQuestionRepository.deleteById(id);
    }

    public Optional<ReponseQuestion> assignUserToReponse(Long reponseId, Long userId) {
        Optional<ReponseQuestion> reponseOpt = reponseQuestionRepository.findById(reponseId);
        Optional<Utilisateur> userOpt = utilisateurRepository.findById(userId);

        if (reponseOpt.isPresent() && userOpt.isPresent()) {
            ReponseQuestion reponse = reponseOpt.get();
            Utilisateur user = userOpt.get();

            // Assuming ReponseQuestion has a field to store the user
            reponse.setUtilisateur(user);
            return Optional.of(reponseQuestionRepository.save(reponse));
        }
        return Optional.empty();
    }
}
