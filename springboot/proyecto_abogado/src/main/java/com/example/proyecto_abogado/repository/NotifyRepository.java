package com.example.proyecto_abogado.repository;

import com.example.proyecto_abogado.entities.Notify;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotifyRepository extends CrudRepository<Notify, Long> {
    List<Notify> findByUser_IdUserOrderByDateRegisterDesc(Long id);
}
