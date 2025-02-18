package com.finlogic.fincode.controllers;

import com.finlogic.fincode.dto.LoginRequest;
import com.finlogic.fincode.dto.LoginResponse;
import com.finlogic.fincode.entities.Log;
import com.finlogic.fincode.entities.Utilisateur;
import com.finlogic.fincode.services.LogService;
import com.finlogic.fincode.services.jwt.UtilisateurServiceImpl;
import com.finlogic.fincode.utils.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/login")
public class LoginController {

    private final AuthenticationManager authenticationManager;
    private final UtilisateurServiceImpl customerService;
    private final JwtUtil jwtUtil;
    private final LogService logService;

    @Autowired
    public LoginController(
            AuthenticationManager authenticationManager,
            UtilisateurServiceImpl customerService,
            JwtUtil jwtUtil,
            LogService logService
    ) {
        this.authenticationManager = authenticationManager;
        this.customerService = customerService;
        this.jwtUtil = jwtUtil;
        this.logService = logService;
    }

    @PostMapping
    public LoginResponse login(@RequestBody LoginRequest loginRequest, HttpServletRequest request, HttpServletResponse response) throws IOException {
        Utilisateur utilisateur = customerService.getUserByEmail(loginRequest.getEmail());

        // Check if the user is blocked
        if (utilisateur.isBlocked() && utilisateur.getBlockedUntil() != null) {
            if (utilisateur.getBlockedUntil().isAfter(LocalDateTime.now())) {
                response.sendError(HttpServletResponse.SC_FORBIDDEN, "User is blocked until " + utilisateur.getBlockedUntil());
                return null;
            } else {
                // Auto-unblock if the block period has expired
                utilisateur.setBlocked(false);
                utilisateur.setBlockedUntil(null);
                customerService.saveUser(utilisateur);
            }
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Incorrect email or password.");
        } catch (DisabledException disabledException) {
            response.sendError(HttpServletResponse.SC_NOT_FOUND, "Utilisateur is not activated");
            return null;
        }

        final UserDetails userDetails = customerService.loadUserByUsername(loginRequest.getEmail());
        final String jwt = jwtUtil.generateToken(userDetails.getUsername());

        // Get user's IP address
        String ipAddress = getClientIp(request);

        // Log successful login
        String logMessage = "User " + utilisateur.getEmail() + " logged in successfully from IP: " + ipAddress;
        logService.createLogForUser(logMessage, utilisateur.getId());

        return new LoginResponse(jwt, utilisateur);
    }


    private String getClientIp(HttpServletRequest request) {
        String ipAddress = request.getHeader("X-Forwarded-For"); // Check if behind a proxy
        if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getRemoteAddr(); // Get direct IP
        }
        return ipAddress;
    }
}
