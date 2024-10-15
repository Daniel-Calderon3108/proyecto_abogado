package com.example.proyecto_abogado.DTO;


import com.example.proyecto_abogado.entities.CaseProcess;
import lombok.*;

@Getter
@Setter
@ToString
public class nameCase {
    private Long idCase;
    private String nameCase;

    public nameCase() {

    }

    public nameCase(CaseProcess caseProcess) {
        this.idCase = caseProcess.getIdCase();
        this.nameCase = caseProcess.getNameCase();
    }
}
