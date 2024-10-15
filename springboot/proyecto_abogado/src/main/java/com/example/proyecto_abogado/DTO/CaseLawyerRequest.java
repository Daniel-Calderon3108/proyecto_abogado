package com.example.proyecto_abogado.DTO;

import com.example.proyecto_abogado.entities.CaseLawyer;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class CaseLawyerRequest {
    private Long idCaseLawyer;
    private String dateRegisterLawyer;
    private String userRegisterLawyer;
    private String statusLawyerCase;
    private Long idLawyer;
    private String nameLawyer;
    private String phoneLawyer;
    private String emailLawyer;
    private Long idCase;
    private String nameCase;
    private String descriptionCase;

    public CaseLawyerRequest() {

    }

    public CaseLawyerRequest(CaseLawyer caseLawyer) {
        this.idCaseLawyer = caseLawyer.getId_lawyer_case();
        this.dateRegisterLawyer = caseLawyer.getDateRegisterLawyer();
        this.userRegisterLawyer = caseLawyer.getUserRegisterLawyer();
        this.statusLawyerCase = caseLawyer.getStatusLawyerCase();
        this.idLawyer = caseLawyer.getLawyer().getId_lawyer();
        this.nameLawyer = caseLawyer.getLawyer().getNameLawyer();
        this.phoneLawyer = caseLawyer.getLawyer().getPhoneLawyer();
        this.emailLawyer = caseLawyer.getLawyer().getEmailLawyer();
        this.idCase = caseLawyer.getCaseProcess().getIdCase();
        this.nameCase = caseLawyer.getCaseProcess().getNameCase();
        this.descriptionCase = caseLawyer.getCaseProcess().getDescriptionCase();
    }
}
