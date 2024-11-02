package com.example.proyecto_abogado.DTO;

import com.example.proyecto_abogado.entities.CommentCase;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class CommentCaseRequest {
    private Long idComment;
    private String description;
    private boolean isImportant;
    private String dateRegister;
    private String lastUpdate;
    private boolean isUpdate;
    private Long idCase;
    private String nameCase;
    private Long idUser;
    private String nameUser;
    private String photoUser;

    public CommentCaseRequest() {
    }

    public CommentCaseRequest(CommentCase commentCase) {
        this.idComment = commentCase.getIdComment();
        this.description = commentCase.getDescription();
        this.isImportant = commentCase.isImportant();
        this.dateRegister = commentCase.getDateRegister();
        this.lastUpdate = commentCase.getLastUpdate();
        this.isUpdate = commentCase.isUpdate();
        this.idCase = commentCase.getCaseProcess().getIdCase();
        this.nameCase = commentCase.getCaseProcess().getNameCase();
        this.idUser = commentCase.getUser().getId_user();
        this.nameUser = commentCase.getUser().getNameUser();
        this.photoUser = commentCase.getUser().getPhotoUser();
    }
}
