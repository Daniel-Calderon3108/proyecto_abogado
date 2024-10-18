package com.example.proyecto_abogado.entities;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "lawyer")
@Getter
@Setter
@ToString
@EqualsAndHashCode

public class Lawyer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_lawyer;
    @Column(name = "name_lawyer")
    private String nameLawyer;
    @Column(name = "phone_lawyer")
    private String phoneLawyer;
    @Column(name = "email_lawyer")
    private String emailLawyer;
    @Column(name = "type_lawyer")
    private String typeLawyer;
    @Column(name = "user_register_lawyer")
    private String userRegisterLawyer;
    @Column(name = "date_register_lawyer")
    private String dateRegisterLawyer;
    @Column(name = "user_update_lawyer")
    private String userUpdateLawyer;
    @Column(name = "date_update_lawyer")
    private String dateUpdateLawyer;
    @Column(name = "type_document_lawyer")
    private String typeDocumentLawyer;
    @Column(name = "document_lawyer")
    private String documentLawyer;
    @Column(name = "status_lawyer")
    private boolean statusLawyer;


    // Manera correcta de hacer una relacion 1 a 1
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id_lawyer", referencedColumnName = "id_user")
    private User user;

    // Relacion uno a muchos
    @OneToMany(mappedBy = "lawyer", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference ("lawyers-case") // Evitar bucle, lado principal
    private List<CaseLawyer> caseLawyer = new ArrayList<>();
}
