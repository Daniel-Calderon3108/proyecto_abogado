package com.example.proyecto_abogado.controllers;

import com.example.proyecto_abogado.DTO.LoginRequest;
import com.example.proyecto_abogado.DTO.Response;
import com.example.proyecto_abogado.entities.User;
import com.example.proyecto_abogado.repository.UserRepository;
import com.example.proyecto_abogado.services.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RequestMapping("api/user")
@RestController
public class UserController {

    @Autowired
    private IUserService service;

    @Autowired
    private UserRepository userRepository;

    // EndPoint Listar Usuarios
    @GetMapping("")
    public List<User> getAll() { return service.getAll(); }

    // EndPoint De Registro Usuario
    @PostMapping("register")
    public ResponseEntity<?> save(@RequestBody User user) {
        System.out.println("Usuario recibido: " + user); // Imprime el objeto completo
        try {
            service.save(user);
            return ResponseEntity.ok(new Response(true, "Usuario registrado exitosamente."));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new Response(false, "Error al registrar el usuario: "
                    + e.getMessage()));
        }

    }

    // EndPoint Iniciar Sesión
    @PostMapping("login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        String name = loginRequest.getName();
        String password = loginRequest.getPassword();

        // Buscar Por Usuario
        Optional<User> userLogin = userRepository.findByNameUser(name);

        // Verificar si el usuario existe
        if (userLogin.isPresent()) {

            User user = userLogin.get();
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            if (passwordEncoder.matches(password, user.getPasswordUser())) { // Comparar la contraseña con la cifrada
                return ResponseEntity.ok().body(new Response(true, "Inicio de sesión exitoso."));
            } else {
                return ResponseEntity.status(401).body(new Response(false, "Usuario o Contraseña Incorrectos."));
            }
        } else {
            return ResponseEntity.status(401).body(new Response(false, "Usuario o Contraseña Incorrectos."));
        }
    }

    // EndPoint Buscar Por Nombre
    @GetMapping("search/{name}")
    public User getByName(@PathVariable String name) { return service.findByName(name); }
}
