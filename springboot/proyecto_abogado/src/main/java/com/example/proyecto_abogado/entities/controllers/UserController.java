package com.example.proyecto_abogado.entities.controllers;

import com.example.proyecto_abogado.entities.User;
import com.example.proyecto_abogado.services.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class UserController {

    @Autowired
    private IUserService service;

    @GetMapping("Users")
    public List<User> getAll() { return service.getAll(); }

    @PostMapping("newUser")
    public Long save(@RequestBody User user) {
        User userSave =  service.save(user);
        return userSave.getUsuario_id();
    }
}
