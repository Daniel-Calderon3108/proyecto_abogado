package com.example.proyecto_abogado.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
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

    @OneToOne
    @JoinColumn(name = "usuario_id", referencedColumnName = "usuario_id")
    @JsonManagedReference // Indica que este es el lado "manejado" de la relación
    private User usuario;

}
