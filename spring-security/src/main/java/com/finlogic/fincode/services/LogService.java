package com.finlogic.fincode.services;

import com.finlogic.fincode.entities.Log;
import com.finlogic.fincode.entities.Utilisateur;
import com.finlogic.fincode.repository.LogRepository;
import com.finlogic.fincode.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LogService {

    private final LogRepository logRepository;
    private final UtilisateurRepository utilisateurRepository;

    public List<Log> getAllLogs() {
        return logRepository.findAll();
    }

    public Optional<Log> getLogById(Long id) {
        return logRepository.findById(id);
    }

    public List<Log> getLogsByUser(Long userId) {
        return logRepository.findByUtilisateurId(userId);
    }

    public Optional<Log> createLogForUser(String message, Long userId) {
        Optional<Utilisateur> userOpt = utilisateurRepository.findById(userId);
        if (userOpt.isPresent()) {
            Log log = new Log(message, userOpt.get());
            return Optional.of(logRepository.save(log));
        }
        return Optional.empty();
    }

    public void deleteLog(Long id) {
        logRepository.deleteById(id);
    }
}
