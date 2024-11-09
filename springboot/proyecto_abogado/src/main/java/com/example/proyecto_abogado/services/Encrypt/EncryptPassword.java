package com.example.proyecto_abogado.services.Encrypt;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class EncryptPassword implements IEncryptPassword{

    @Autowired
    private BCryptPasswordEncoder encrypt;

    @Override
    public String encryptExistingPasswords(String password) {
        if (!password.startsWith("$2a$")) { // Verificar que la clave enviada no este encriptada
            return encrypt.encode(password);
        }
        return password;
    }
}
