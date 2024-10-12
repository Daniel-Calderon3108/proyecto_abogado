package com.example.proyecto_abogado.entities;

import lombok.*;

import javax.persistence.*;

@Entity
@Table(name = "cliente")
@Getter
@Setter
@ToString
@EqualsAndHashCode

public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cliente_id;
    private String nombre;
    private String direccion;
    private String telefono;
    private String correo;
    private String tipo_cliente;
    private String usuario_registra;
    private String fecha_registra;
    private String usuario_actualiza;
    private String fecha_actualiza;
    private String tipo_documento;
    private String documento;

    // Manera correcta de hacer una relacion 1 a 1
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "usuario_id", referencedColumnName = "usuario_id")
    private User usuario;
}
