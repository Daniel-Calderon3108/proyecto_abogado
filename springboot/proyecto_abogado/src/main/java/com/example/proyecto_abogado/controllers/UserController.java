package com.example.proyecto_abogado.controllers;

import com.example.proyecto_abogado.DTO.LoginRequest;
import com.example.proyecto_abogado.entities.User;
import com.example.proyecto_abogado.repository.UserRepository;
import com.example.proyecto_abogado.services.IUserService;
import lombok.Getter;
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

    @GetMapping("")
    public List<User> getAll() { return service.getAll(); }

    //enpoint de registro
    @PostMapping("register")
    public ResponseEntity<LoginResponse> save(@RequestBody User user) {
        System.out.println("Customer recibido: " + user); // Imprime el objeto completo
        try {
            service.save(user);
            return ResponseEntity.ok(new LoginResponse(true, "Usuario registrado exitosamente."));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new LoginResponse(false, "Error al registrar el usuario: " + e.getMessage()));
        }

    }

    // Endpoint para login
    @PostMapping("login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        String nombre = loginRequest.getName();
        String contrasena = loginRequest.getPassword();

        // Buscar usuario por el nombre
        Optional<User> UserOpt = userRepository.findByName(nombre);

        // Verificar si el usuario existe
        if (UserOpt.isPresent()) {
            User user = UserOpt.get();

            // Comparar la contraseña con la cifrada
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            if (passwordEncoder.matches(contrasena, user.getPassword_user())) {
                return ResponseEntity.ok().body(new LoginResponse(true, "Inicio de sesión exitoso."));
            } else {
                return ResponseEntity.status(401).body(new LoginResponse(false, "Contraseña incorrecta."));
            }
        } else {
            return ResponseEntity.status(401).body(new LoginResponse(false, "El usuario no está registrado."));
        }
    }

    // Clase para la respuesta de login
    @Getter
    public static class LoginResponse {
        private final boolean success;
        private final String message;

        public LoginResponse(boolean success, String message) {
            this.success = success;
            this.message = message;
        }
    }
}
