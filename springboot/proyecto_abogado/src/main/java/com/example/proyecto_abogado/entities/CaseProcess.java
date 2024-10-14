package com.example.proyecto_abogado.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "case_process")
@Getter
@Setter
@ToString
@EqualsAndHashCode
public class CaseProcess {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_case;
    @Column(name = "name_case")
    private String nameCase;
    @Column(name = "description_case")
    private String descriptionCase;
    @Column(name = "date_init_case")
    private String dateInitCase;
    @Column(name = "date_end_case")
    private String dateEndCase;
    @Column(name = "status_case")
    private String statusCase;
    @Column(name = "user_register_case")
    private String userRegisterCase;
    @Column(name = "date_register_case")
    private String dateRegisterCase;
    @Column(name = "update_user_case")
    private String updateUserCase;
    @Column(name = "update_date_case")
    private String updateDateCase;
    @Column(name = "type_case")
    private String typeCase;

    // Relacion muchos a uno
    @ManyToOne(fetch = FetchType.LAZY) // Cargo bajo demanda
    @JoinColumn(name = "id_client_case", referencedColumnName = "id_client")
    @JsonBackReference // Evitar crear bucle
    private Customer customer;

    // Relacion uno a muchos
    @OneToMany(mappedBy = "caseProcess", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference // Evitar bucle
    private List<CaseLawyer> caseLawyer = new ArrayList<>();

    /*
    @OneToMany(mappedBy = "idCase", cascade = CascadeType.ALL)
    private List<Document> documents;
     */
}
