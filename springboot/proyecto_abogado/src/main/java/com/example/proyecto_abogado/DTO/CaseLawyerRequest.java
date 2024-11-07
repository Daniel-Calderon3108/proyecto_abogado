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
    private String documentLawyer;
    private Long idCase;
    private String nameCase;
    private String descriptionCase;
    private String dateInitCase;
    private String dateEndCase;
    private String statusCase;
    private String typeCase;

    public CaseLawyerRequest() {

    }

    public CaseLawyerRequest(CaseLawyer caseLawyer) {
        this.idCaseLawyer = caseLawyer.getId_lawyer_case();
        this.dateRegisterLawyer = caseLawyer.getDateRegisterLawyer();
        this.userRegisterLawyer = caseLawyer.getUserRegisterLawyer();
        this.statusLawyerCase = caseLawyer.getStatusLawyerCase();
        this.idLawyer = caseLawyer.getLawyer().getIdLawyer();
        this.nameLawyer = caseLawyer.getLawyer().getNameLawyer();
        this.phoneLawyer = caseLawyer.getLawyer().getPhoneLawyer();
        this.emailLawyer = caseLawyer.getLawyer().getEmailLawyer();
        this.documentLawyer = caseLawyer.getLawyer().getDocumentLawyer();
        this.idCase = caseLawyer.getCaseProcess().getIdCase();
        this.nameCase = caseLawyer.getCaseProcess().getNameCase();
        this.descriptionCase = caseLawyer.getCaseProcess().getDescriptionCase();
        this.dateInitCase = caseLawyer.getCaseProcess().getDateInitCase();
        this.dateEndCase = caseLawyer.getCaseProcess().getDateEndCase();
        this.statusCase = caseLawyer.getCaseProcess().getStatusCase();
        this.typeCase = caseLawyer.getCaseProcess().getTypeCase();
    }
}
