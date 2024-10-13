package com.example.proyecto_abogado.services;

import com.example.proyecto_abogado.entities.User;
import com.example.proyecto_abogado.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService implements IUserService {

    @Autowired
    private UserRepository repository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public List<User> getAll() { return (List<User>) repository.findAll(); }

    @Override
    public void save(User user) {
        // Verificar si la contraseña ya está cifrada
        if (!user.getPassword_user().startsWith("$2a$")) { // BCrypt hashes start with $2a$
            // Cifrar la contraseña antes de guardarla
            String contrasenaCifrada = passwordEncoder.encode(user.getPassword_user());
            user.setPassword_user(contrasenaCifrada);
        }
        repository.save(user);
    }

    public void encryptExistingPasswords() {
        List<User> userList = (List<User>) repository.findAll();
        for (User user : userList) {
            if (!user.getPassword_user().startsWith("$2a$")) {
                String encryptedPassword = passwordEncoder.encode(user.getPassword_user());
                user.setPassword_user(encryptedPassword);
                repository.save(user);
            }
        }
    }
}
