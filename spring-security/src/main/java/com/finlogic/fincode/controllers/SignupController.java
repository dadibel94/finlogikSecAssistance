package com.finlogic.fincode.controllers;

import com.finlogic.fincode.dto.SignupRequest;
import com.finlogic.fincode.entities.Utilisateur;
import com.finlogic.fincode.services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/signup")
public class SignupController {

    private final AuthService authService;

    @Autowired
    public SignupController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping
    public ResponseEntity<?> signupCustomer(@RequestBody SignupRequest signupRequest) {
        Utilisateur createdUtilisateur = authService.createUtilisateur(signupRequest);
        if (createdUtilisateur != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(createdUtilisateur);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to create customer");
        }
    }

}
