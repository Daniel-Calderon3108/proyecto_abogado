package com.example.proyecto_abogado.repository;

import com.example.proyecto_abogado.entities.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends CrudRepository<User, Long> {
    Optional<User> findByNameUser(String username);
    User findBynameUser(String name);
}
