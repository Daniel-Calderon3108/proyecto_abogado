package com.example.proyecto_abogado.DTO;

import com.example.proyecto_abogado.entities.CaseLawyer;
import com.example.proyecto_abogado.entities.Lawyer;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@ToString
public class LawyerRequest {
    private Long idLawyer;
    private String nameLawyer;
    private String phoneLawyer;
    private String emailLawyer;
    private String typeLawyer;
    private String userRegisterLawyer;
    private String dateRegisterLawyer;
    private String userUpdateLawyer;
    private String dateUpdateLawyer;
    private String typeDocumentLawyer;
    private String documentLawyer;
    private boolean statusLawyer;
    // Usuario
    private Long idUser;
    private String nameUser;
    private boolean statusUser;
    private List<CaseLawyerRequest> caseLawyer;

    public LawyerRequest() {

    }

    public LawyerRequest(Lawyer lawyer) {
        this.idLawyer = lawyer.getId_lawyer();
        this.nameLawyer = lawyer.getNameLawyer();
        this.phoneLawyer = lawyer.getPhoneLawyer();
        this.emailLawyer = lawyer.getEmailLawyer();
        this.typeLawyer = lawyer.getTypeLawyer();
        this.userRegisterLawyer = lawyer.getUserRegisterLawyer();
        this.dateRegisterLawyer = lawyer.getDateRegisterLawyer();
        this.userUpdateLawyer = lawyer.getUserUpdateLawyer();
        this.dateUpdateLawyer = lawyer.getDateUpdateLawyer();
        this.typeDocumentLawyer = lawyer.getTypeDocumentLawyer();
        this.documentLawyer = lawyer.getDocumentLawyer();
        this.statusLawyer = lawyer.isStatusLawyer();
        this.idUser = lawyer.getUser().getIdUser();
        this.nameUser = lawyer.getUser().getNameUser();
        this.statusUser = lawyer.getUser().isStatusUser();
        this.caseLawyer = lawyer.getCaseLawyer().stream()
                .map(caseLawyer -> new CaseLawyerRequest(caseLawyer)).collect(Collectors.toList());
    }
}
