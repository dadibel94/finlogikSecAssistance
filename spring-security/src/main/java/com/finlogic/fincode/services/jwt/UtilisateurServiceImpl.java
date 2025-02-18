package com.finlogic.fincode.services.jwt;

import com.finlogic.fincode.entities.Utilisateur;
import com.finlogic.fincode.repository.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;

@Service
public class UtilisateurServiceImpl implements UserDetailsService {

    private final UtilisateurRepository utilisateurRepository;

    @Autowired
    public UtilisateurServiceImpl(UtilisateurRepository utilisateurRepository) {
        this.utilisateurRepository = utilisateurRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Write logic to fetch utilisateur from DB
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur not found with email: " + email));

        return new org.springframework.security.core.userdetails.User(utilisateur.getEmail(), utilisateur.getPassword(), Collections.emptyList());
    }
    public String getRoleByEmail(String email) {
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur not found with email: " + email));
        return utilisateur.getRole(); // Assure-toi que la classe Utilisateur a bien un champ 'role'
    }
    
    public String getNameByEmail(String email) {
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur not found with email: " + email));
        return utilisateur.getName(); // Assure-toi que Utilisateur possède un champ 'name'
    }
    
    
    public Utilisateur getUserByEmail(String email) {
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur not found with email: " + email));
        return utilisateur;
    }

    public Utilisateur getUserById(Long id) {
        Optional<Utilisateur> user = utilisateurRepository.findById(id);
        return user.orElse(null);
    }

    public void saveUser(Utilisateur utilisateur) {
        utilisateurRepository.save(utilisateur);
    }

}

