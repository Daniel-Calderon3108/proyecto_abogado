package com.example.proyecto_abogado.services.notify;

import com.example.proyecto_abogado.DTO.NotifyRequest;
import com.example.proyecto_abogado.entities.Notify;

import java.util.List;

public interface INotifyService {
    List<Notify> getNotifyByIdUser(Long id);
    Notify save(NotifyRequest notify);
}
