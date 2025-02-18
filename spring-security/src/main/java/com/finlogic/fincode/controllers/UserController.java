package com.finlogic.fincode.controllers;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import com.finlogic.fincode.dto.SignupRequest;
import com.finlogic.fincode.entities.Log;
import com.finlogic.fincode.entities.Utilisateur;
import com.finlogic.fincode.repository.LogRepository;
import jdk.jshell.execution.Util;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.finlogic.fincode.repository.UtilisateurRepository;

@RestController
@CrossOrigin("*")
@RequestMapping("api/users")
public class UserController {

	
	@Autowired
	private UtilisateurRepository cr;

	@Autowired
	private LogRepository log;
	
	
	@GetMapping
	    public ResponseEntity getUsers() {
		
		List<Utilisateur> utilisateurs = cr.findAll();
	        if (utilisateurs != null) {

				
	            return ResponseEntity.status(HttpStatus.OK).body(utilisateurs);
	        } else {

				
	            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to get utilisateurs");
	        }
	    }

	@GetMapping("/quest")
	public ResponseEntity getQuestions(@RequestParam Long id) {

		Optional<Utilisateur> utilisateur = cr.findById(id);

		if (utilisateur != null) {

			
			return ResponseEntity.status(HttpStatus.OK).body(utilisateur.get().getGroupQuestions());
		} else {

			
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to get utilisateurs");
		}
	}
}
