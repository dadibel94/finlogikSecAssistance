package com.finlogic.fincode.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReponseQuestion {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false)
    private Long id;

    private String reponse;

    @ManyToOne
    @JoinColumn(name = "group_question_id", nullable = false)
    private GroupQuestion groupQuestion;  // Added: Link to the GroupQuestion

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private Utilisateur utilisateur;  // Added: Link to the User who answered
}
