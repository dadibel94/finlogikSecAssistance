package com.finlogic.fincode.services;

import com.finlogic.fincode.entities.GroupQuestion;
import com.finlogic.fincode.entities.ReponseQuestion;
import com.finlogic.fincode.entities.Utilisateur;
import com.finlogic.fincode.repository.GroupQuestionRepository;
import com.finlogic.fincode.repository.ReponseQuestionRepository;
import com.finlogic.fincode.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GroupQuestionService {

    @Autowired
    private final GroupQuestionRepository groupQuestionRepository;

    @Autowired
    private final UtilisateurRepository utilisateurRepository;

    @Autowired
    private final ReponseQuestionRepository reponseQuestionRepository;

    public List<GroupQuestion> getAllGroupQuestions() {
        return groupQuestionRepository.findAll();
    }

    public Optional<GroupQuestion> getGroupQuestionById(Long id) {
        return groupQuestionRepository.findById(id);
    }

    public GroupQuestion createGroupQuestion(GroupQuestion groupQuestion) {
        return groupQuestionRepository.save(groupQuestion);
    }

    public Optional<GroupQuestion> updateGroupQuestion(Long id, GroupQuestion updatedGroup) {
        return groupQuestionRepository.findById(id).map(existingGroup -> {
            existingGroup.setNomGroup(updatedGroup.getNomGroup());
            return groupQuestionRepository.save(existingGroup);
        });
    }

    public void deleteGroupQuestion(Long id) {
        groupQuestionRepository.deleteById(id);
    }

    public Optional<GroupQuestion> addUserToGroup(Long groupId, Long userId) {
        Optional<GroupQuestion> groupOpt = groupQuestionRepository.findById(groupId);
        Optional<Utilisateur> userOpt = utilisateurRepository.findById(userId);

        if (groupOpt.isPresent() && userOpt.isPresent()) {
            GroupQuestion group = groupOpt.get();
            Utilisateur user = userOpt.get();
            group.getUtilisateurs().add(user);
            return Optional.of(groupQuestionRepository.save(group));
        }
        return Optional.empty();
    }

    public Optional<GroupQuestion> addResponseToGroup(Long groupId, ReponseQuestion response) {
        Optional<GroupQuestion> groupOpt = groupQuestionRepository.findById(groupId);

        if (groupOpt.isPresent()) {
            GroupQuestion group = groupOpt.get();
            response.setGroupQuestion(group);
            reponseQuestionRepository.save(response);
            group.getReponses().add(response);
            return Optional.of(groupQuestionRepository.save(group));
        }
        return Optional.empty();
    }
}
