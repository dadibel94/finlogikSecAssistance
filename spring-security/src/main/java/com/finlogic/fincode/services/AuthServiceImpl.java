package com.finlogic.fincode.services;

import com.finlogic.fincode.dto.SignupRequest;
import com.finlogic.fincode.entities.Utilisateur;
import com.finlogic.fincode.repository.UtilisateurRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final UtilisateurRepository utilisateurRepository;

    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AuthServiceImpl(UtilisateurRepository utilisateurRepository, PasswordEncoder passwordEncoder) {
        this.utilisateurRepository = utilisateurRepository;
        this.passwordEncoder = passwordEncoder;
    }


    @Override
    public Utilisateur createUtilisateur(SignupRequest signupRequest) {
        //Check if utilisateur already exist
        if (utilisateurRepository.existsByEmail(signupRequest.getEmail())) {
            return null;
        }

        Utilisateur utilisateur = new Utilisateur();
        BeanUtils.copyProperties(signupRequest, utilisateur);

        //Hash the password before saving
        String hashPassword = passwordEncoder.encode(signupRequest.getPassword());
        utilisateur.setPassword(hashPassword);
        Utilisateur createdUtilisateur = utilisateurRepository.save(utilisateur);
        utilisateur.setId(createdUtilisateur.getId());
        return utilisateur;
    }
}
