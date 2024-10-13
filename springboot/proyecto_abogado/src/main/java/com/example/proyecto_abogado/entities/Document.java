package com.example.proyecto_abogado.entities;

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
    private String url_document;
    private String name_document;
    private String type_document;
    private String status_document;
    private String user_register_document;
    private String date_document;
    private String user_update_document;
    private String date_update_document;
    private String id_case;
}
