package com.example.proyecto_abogado.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.Hibernate;

import javax.persistence.*;

@Entity
@Table(name = "lawyer_case")
@Getter
@Setter
@ToString
@EqualsAndHashCode
public class CaseLawyer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_lawyer_case;
    @Column(name = "date_register_lawyer")
    private String dateRegisterLawyer;
    @Column(name = "user_register_lawyer")
    private String userRegisterLawyer;
    @Column(name = "status_lawyer_case")
    private String statusLawyerCase;

    // Relacion muchos a uno con abogado
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_lawyer")
    @JsonBackReference ("lawyers-case") // Evitar bucle
    private Lawyer lawyer;

    // Relacion muchos a uno con caso
    @ManyToOne
    @JoinColumn(name = "id_case")
    @JsonBackReference  ("relation-case")// Evitar bucle, lado principal
    private CaseProcess caseProcess;
}
