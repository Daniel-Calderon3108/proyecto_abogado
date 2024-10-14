package com.example.proyecto_abogado.DTO;

import com.example.proyecto_abogado.entities.Lawyer;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class LawyerRequest {
    private Long idLawyer;
    private String nameLawyer;

    public LawyerRequest() {

    }

    public LawyerRequest(Lawyer lawyer) {
        this.idLawyer = lawyer.getId_lawyer();
        this.nameLawyer = lawyer.getNameLawyer();
    }
}
