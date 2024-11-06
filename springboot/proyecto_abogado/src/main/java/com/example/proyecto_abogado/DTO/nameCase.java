package com.example.proyecto_abogado.DTO;


import com.example.proyecto_abogado.entities.CaseProcess;
import lombok.*;

@Data
public class nameCase {
    private Long idCase;
    private String nameCase;
    private String typeCase;

    public nameCase() {

    }

    public nameCase(CaseProcess caseProcess) {
        this.idCase = caseProcess.getIdCase();
        this.nameCase = caseProcess.getNameCase();
        this.typeCase = caseProcess.getTypeCase();
    }
}
