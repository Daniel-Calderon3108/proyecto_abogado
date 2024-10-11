package com.example.proyecto_abogado.services;

import com.example.proyecto_abogado.entities.User;

import java.util.List;

public interface IUserService {
    List<User> getAll();
    User save(User user);
}
