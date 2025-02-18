package com.finlogic.fincode.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class GroupQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false)
    private Long id;

    private String nomGroup;

    private String description;

    @ManyToMany
    @JoinTable(
            name = "group_question_users",
            joinColumns = @JoinColumn(name = "group_question_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<Utilisateur> utilisateurs;

    @OneToMany(mappedBy = "groupQuestion", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ReponseQuestion> reponses;
}

