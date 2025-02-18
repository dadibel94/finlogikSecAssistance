package com.finlogic.fincode.dto;

import com.finlogic.fincode.entities.Utilisateur;

public class LoginResponse {
    private String jwt;
    private String role;  // Ajout du rôle
	private String name;

	private Utilisateur utilisateur;
	
    public LoginResponse(String jwt, String role, String name) {
        this.jwt = jwt;
        this.role = role;
        this.name = name;
        
    }

    public LoginResponse (String jwt, Utilisateur utilisateur) {
    	
    	this.jwt = jwt;
    	this.utilisateur = utilisateur;
    }
    public String getJwt() {
        return jwt;
    }
    
    public Utilisateur getUser() {
        return utilisateur;
    }


    public String getRole() {
        return role;
    }
    public String getName() {
        return name;
    }
    
   
}