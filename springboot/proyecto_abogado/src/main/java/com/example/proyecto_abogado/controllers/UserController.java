package com.example.proyecto_abogado.controllers;

import com.example.proyecto_abogado.DTO.LoginRequest;
import com.example.proyecto_abogado.DTO.Response;
import com.example.proyecto_abogado.entities.User;
import com.example.proyecto_abogado.repository.UserRepository;
import com.example.proyecto_abogado.services.Encrypt.EncryptPassword;
import com.example.proyecto_abogado.services.uploadFile.UploadFIleService;
import com.example.proyecto_abogado.services.user.IUserService;
import com.example.proyecto_abogado.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

@RequestMapping("api/user")
@RestController
public class UserController {

    @Autowired
    private IUserService service;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EncryptPassword encriptPassword;

    @Autowired
    private UploadFIleService uploadFIleService;

    @Autowired
    private JwtUtil jwtUtil;

    // EndPoint Listar Usuarios
    @GetMapping("")
    public List<User> getAll() { return service.getAll(); }

    // EndPoint De Registro Usuario
    @PostMapping("register")
    public ResponseEntity<?> save(@RequestBody User user) {
        System.out.println("Usuario recibido: " + user); // Imprime el objeto completo
        try {
            User userRegister = service.save(user);
            return ResponseEntity.ok(new Response(true, "Usuario registrado exitosamente.", userRegister.getNameUser()));
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

        if (userLogin.isPresent()) {
            User user = userLogin.get();
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

            // Verificar contraseña cifrada
            if (passwordEncoder.matches(password, user.getPasswordUser())) {
                // Generar token JWT
                String token = jwtUtil.create(user.getIdUser().toString(), user.getNameUser());  // Usar 'create' en lugar de 'generateToken'
                return ResponseEntity.ok().body(new Response(true, "Inicio de sesión exitoso.", token, user));
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

    // EndPoint Actualizar Usuario
    @PutMapping("update/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody User user) {
        Optional<User> userData = userRepository.findById(id);

        if(userData.isPresent()) {
            User updateUser = userData.get();
            // Validar si el usuario va a realizar cambio de clave
            String password = user.getPasswordUser() == null ? updateUser.getPasswordUser() :
                    encriptPassword.encryptExistingPasswords(user.getPasswordUser());
            updateUser.setNameUser(user.getNameUser());
            updateUser.setPasswordUser(password);
            updateUser.setUserUpdate(user.getUserUpdate());
            updateUser.setLastUpdate(user.getLastUpdate());
            updateUser.setPhotoUser(user.getPhotoUser());
            updateUser.setStatusUser(user.isStatusUser());
            updateUser.setRolUser(user.getRolUser());
            System.out.println("Datos Usuario a Actualizar " + updateUser);
            userRepository.save(updateUser);
            return ResponseEntity.ok().body(new Response(true,"Se actualizo el usuario.", updateUser.getNameUser()));
        }
        return ResponseEntity.status(401).body(new Response(false, "Usuario no encontrado"));
    }

    // EndPoint Actualizar Status Usuario
    @PutMapping("changeStatus/{id}")
    public ResponseEntity<?> changeStatus(@PathVariable Long id, @RequestBody User user) {
        Optional<User> userData = userRepository.findById(id);

        if(userData.isPresent()) {
            User updateUser = userData.get();
            updateUser.setStatusUser(!updateUser.isStatusUser());
            updateUser.setUserUpdate(user.getUserUpdate());
            updateUser.setLastUpdate(user.getLastUpdate());
            userRepository.save(updateUser);
            return ResponseEntity.ok().body(new Response(true, "Se cambio el status a " + updateUser.isStatusUser()));
        }
        return ResponseEntity.status(401).body(new Response(false, "Usuario no encontrado"));
    }

    // EndPoint Buscar Usuario Por ID
    @GetMapping("searchById/{id}")
    public User getById(@PathVariable Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("No se encontro el usuario"));
    }

    @PostMapping("uploadPhoto")
    public ResponseEntity<?> uploadPhoto(@RequestParam("file")MultipartFile file) {
        try {
            String filename = uploadFIleService.saveFile(file);
            return ResponseEntity.ok(new Response(true, "Se subio la imagen con exito.", filename));
        } catch (IOException e) {
            return ResponseEntity.status(500).body(new Response(false, "Error al guardar el archivo "
                    + e.getMessage()));
        }
    }

    @GetMapping("searchPhoto/{filename}")
    public ResponseEntity<?> getPhoto(@PathVariable String filename) {
        try {
            String uploadPath = "photos_users";
            Path path = Paths.get(uploadPath).resolve(filename).normalize();

            if (!Files.exists(path) || !Files.isReadable(path)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            Resource resource = new UrlResource(path.toUri());

            if(resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(Files.probeContentType(path)))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
            }
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
