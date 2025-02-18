package com.finlogic.fincode.services;

import com.finlogic.fincode.dto.SignupRequest;
import com.finlogic.fincode.entities.Utilisateur;

public interface AuthService {
    Utilisateur createUtilisateur(SignupRequest signupRequest);
}
