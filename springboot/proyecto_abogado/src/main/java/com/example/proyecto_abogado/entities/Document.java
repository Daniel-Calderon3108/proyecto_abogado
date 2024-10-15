package com.example.proyecto_abogado.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;

@Entity
@Table(name = "document")
@Getter
@Setter
@ToString
@EqualsAndHashCode
public class Document {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_document;
    @Column(name = "url_document")
    private String urlDocument;
    @Column(name = "name_document")
    private String nameDocument;
    @Column(name = "type_document")
    private String typeDocument;
    @Column(name = "status_document")
    private String statusDocument;
    @Column(name = "user_register_document")
    private String userRegisterDocument;
    @Column(name = "date_document")
    private String dateDocument;
    @Column(name = "user_update_document")
    private String userUpdateDocument;
    @Column(name = "date_update_document")
    private String dateUpdateDocument;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_case", referencedColumnName = "id_case")
    @JsonBackReference
    private CaseProcess caseProcess;

}
