package com.example.proyecto_abogado.services.user;

import com.example.proyecto_abogado.entities.User;
import com.example.proyecto_abogado.repository.UserRepository;
import com.example.proyecto_abogado.services.Encrypt.EncryptPassword;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class UserService implements IUserService, UserDetailsService {

    @Autowired
    private UserRepository repository;

    @Autowired
    private EncryptPassword encriptPassword;

    @Override
    public List<User> getAll() { return (List<User>) repository.findAll(); }

    @Override
    public User save(User user) {
        user.setPasswordUser(encriptPassword.encryptExistingPasswords(user.getPasswordUser()));
        repository.save(user);
        return user;
    }

    @Override
    public User findByName(String name) { return repository.findBynameUser(name); }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = repository.findBynameUser(username);
        if (user == null) {
            throw new UsernameNotFoundException("Usuario no encontrado: " + username);
        }

        return new org.springframework.security.core.userdetails.User(
                user.getNameUser(),
                user.getPasswordUser(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
        );
    }
}
