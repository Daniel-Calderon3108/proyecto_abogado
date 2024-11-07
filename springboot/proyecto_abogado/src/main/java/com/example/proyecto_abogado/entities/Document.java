package com.example.proyecto_abogado.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.*;

import javax.persistence.*;

@Entity
@Table(name = "document")
@Data
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class Document {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_document")
    private Long idDocument;
    @Column(name = "name_document")
    private String nameDocument;
    @Column(name = "url_document")
    private String urlDocument;
    @Column(name = "type_document")
    private String typeDocument;
    @Column(name = "user_register_document")
    private String userRegisterDocument;
    @Column(name = "date_document")
    private String dateDocument;
    @Column(name = "user_update_document")
    private String userUpdateDocument;
    @Column(name = "date_update_document")
    private String dateUpdateDocument;
    @Lob
    private byte[] data;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_case", referencedColumnName = "id_case")
    @JsonBackReference ("case-document")
    private CaseProcess caseProcess;

}
