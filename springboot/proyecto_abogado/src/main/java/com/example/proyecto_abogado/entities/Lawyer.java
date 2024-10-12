package com.example.proyecto_abogado.entities;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;

@Entity
@Table(name = "abogado")
@Getter
@Setter
@ToString
@EqualsAndHashCode

public class Lawyer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long abogado_id;
    private String nombre;
    private String telefono;
    private String correo;
    private String especialidad;
    private String usuario_registra;
    private String fecha_registra;
    private String usuario_actualiza;
    private String fecha_actualiza;
    private String tipo_documento;
    private String documento;
    private String estado;

    // Manera correcta de hacer una relacion 1 a 1
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "usuario_id", referencedColumnName = "usuario_id")
    private User usuario;
}
