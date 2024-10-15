package com.example.proyecto_abogado.DTO;

import com.example.proyecto_abogado.entities.CaseProcess;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class CaseProcessRequest {

    private Long idCase;
    private String nameCase;
    private String descriptionCase;
    private String dateInitCase;
    private String dateEndCase;
    private String statusCase;
    private String userRegisterCase;
    private String dateRegisterCase;
    private String updateUserCase;
    private String updateDateCase;
    private String typeCase;
    private CustomerRequest customer;

    public CaseProcessRequest() {

    }

    public CaseProcessRequest (CaseProcess caseProcess) {
        this.idCase = caseProcess.getIdCase();
        this.nameCase = caseProcess.getNameCase();
        this.descriptionCase = caseProcess.getDescriptionCase();
        this.dateInitCase = caseProcess.getDateInitCase();
        this.dateEndCase = caseProcess.getDateEndCase();
        this.statusCase = caseProcess.getStatusCase();
        this.userRegisterCase = caseProcess.getUserRegisterCase();
        this.dateRegisterCase = caseProcess.getDateRegisterCase();
        this.updateUserCase = caseProcess.getUpdateUserCase();
        this.updateDateCase = caseProcess.getUpdateDateCase();
        this.typeCase = caseProcess.getTypeCase();
        this.customer = new CustomerRequest(caseProcess.getCustomer());
    }
}
