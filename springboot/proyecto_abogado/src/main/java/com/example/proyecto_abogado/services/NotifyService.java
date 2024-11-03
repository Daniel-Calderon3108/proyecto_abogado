package com.example.proyecto_abogado.services;

import com.example.proyecto_abogado.DTO.NotifyRequest;
import com.example.proyecto_abogado.entities.Notify;
import com.example.proyecto_abogado.entities.User;
import com.example.proyecto_abogado.repository.NotifyRepository;
import com.example.proyecto_abogado.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotifyService implements INotifyService {

    @Autowired
    private NotifyRepository notifyRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<Notify> getNotifyByIdUser(Long id) { return notifyRepository.findByUser_IdUserOrderByDateRegisterDesc(id); }

    @Override
    public Notify save(NotifyRequest notify) {

        Notify newNotify = new Notify();

        newNotify.setDescriptionNotify(notify.getDescriptionNotify());
        newNotify.setUrlNotify(notify.getUrlNotify());
        newNotify.setTypeNotify(notify.getTypeNotify());
        newNotify.setDateRegister(notify.getDateRegister());
        newNotify.setUserRegister(notify.getUserRegister());
        newNotify.setNotify(notify.isNotify());

        User user = userRepository.findById(notify.getIdUser())
                .orElseThrow(() -> new RuntimeException("No se encontro el usuario"));

        newNotify.setUser(user);

        return notifyRepository.save(newNotify);
    }
}
