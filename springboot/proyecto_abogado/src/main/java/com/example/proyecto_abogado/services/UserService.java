package com.example.proyecto_abogado.services;

import com.example.proyecto_abogado.entities.User;
import com.example.proyecto_abogado.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService implements IUserService {

    @Autowired
    private UserRepository repository;

    @Override
    public List<User> getAll() { return (List<User>) repository.findAll(); }

    @Override
    public User save(User user) {
        repository.save(user);
        return user;
    }
}
