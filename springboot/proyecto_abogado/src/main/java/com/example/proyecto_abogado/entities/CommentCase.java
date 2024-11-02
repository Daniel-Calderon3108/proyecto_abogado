package com.example.proyecto_abogado.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Table(name = "commentcase")
@Entity
@Getter
@Setter
@EqualsAndHashCode
public class CommentCase {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_comment")
    private Long idComment;
    private String description;
    @Column(name = "is_important")
    private boolean isImportant;
    @Column(name = "date_register")
    private String dateRegister;
    @Column(name = "last_update")
    private String lastUpdate;
    @Column(name = "is_update")
    private boolean isUpdate;

    // Muchos a Uno
    @ManyToOne
    @JoinColumn(name = "id_case")
    @JsonBackReference ("comment-case")
    private CaseProcess caseProcess;

    // Muchos a Uno
    @ManyToOne
    @JoinColumn(name = "id_user")
    @JsonBackReference ("comment-user")
    private User user;
}