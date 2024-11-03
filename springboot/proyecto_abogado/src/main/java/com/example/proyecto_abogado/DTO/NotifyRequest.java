package com.example.proyecto_abogado.DTO;

import com.example.proyecto_abogado.entities.Notify;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class NotifyRequest {
    private Long idNotify;
    private String descriptionNotify;
    private String urlNotify;
    private String typeNotify;
    private boolean isNotify;
    private String dateRegister;
    private String userRegister;
    private Long idUser;
    private String nameUser;

    public NotifyRequest() {

    }

    public NotifyRequest(Notify notify) {
        this.idNotify = notify.getIdNotify();
        this.descriptionNotify = notify.getDescriptionNotify();
        this.urlNotify = notify.getUrlNotify();
        this.typeNotify = notify.getTypeNotify();
        this.isNotify = notify.isNotify();
        this.dateRegister = notify.getDateRegister();
        this.userRegister = notify.getUserRegister();
        this.idUser = notify.getUser().getIdUser();
        this.nameUser = notify.getUser().getNameUser();
    }
}
