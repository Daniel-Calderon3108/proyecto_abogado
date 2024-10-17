import { Component, OnInit } from '@angular/core';
import { LawyersService } from 'src/app/services/lawyers.service';
import { Lawyers } from 'src/app/services/model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-form-lawyer',
  templateUrl: './form-lawyer.component.html',
  styleUrls: ['./form-lawyer.component.css']
})
export class FormLawyerComponent implements OnInit {

  // Inicializar variable
  data: Lawyers = {
    id_lawyer: "",
    nameLawyer: "",
    phoneLawyer: "",
    emailLawyer: "",
    typeLawyer: "Penal",
    userRegisterLawyer: "",
    dateRegisterLawyer: "",
    userUpdateLawyer: "",
    dateUpdateLawyer: "",
    typeDocumentLawyer: "Cedula Ciudadania",
    documentLawyer: "",
    statusLawyer: true,
    user: {
        id_user : "",
        nameUser: "",
        passwordUser: "",
        userRegister: "",
        dateRegister: "",
        userUpdate: "",
        lastUpdate: "",
        photoUser: "",
        statusUser: true,
        rolUser: "Abogado",
    }
  };

  constructor(private lawyerService : LawyersService, private router : Router, private activatedRoute : ActivatedRoute) { }

  ngOnInit(): void {
    const param = this.activatedRoute.snapshot;
    this.heightInfo();
  }

  save() {
     // Inicializar variable para manejar fecha
     let date_actual: Date = new Date();
     // Obtener valores fecha por separado
     let year: any = date_actual.getFullYear();
     let month: any = date_actual.getMonth() + 1;
     let day: any = date_actual.getDate();
     let hour: any = date_actual.getHours();
     let minute: any = date_actual.getMinutes();
     let seconds: any = date_actual.getSeconds();

     // Agregar ceros cuando es menor a 10
    if (month < 10) month = `0${month}`;
    if (day < 10) day = `0${day}`;
    if (hour < 10) hour = `0${hour}`;
    if (minute < 10) minute = `0${minute}`;
    if (seconds < 10) seconds = `0${seconds}`;

    // Construir formato fecha para poder enviar a API
    let time: string = `${year}-${month}-${day} ${hour}:${minute}:${seconds}`;

    delete this.data.id_lawyer;
    this.data.userRegisterLawyer = "1"; // Se debe cambiar por el usuario que este logeado (Administrador)
    this.data.dateRegisterLawyer = time;
    this.data.userUpdateLawyer = "1"; // Se debe cambiar por el usuario que este logeado (Administrador)
    this.data.dateUpdateLawyer = time;

    delete this.data.user.id_user;
    this.data.user.userRegister = "1";
    this.data.user.dateRegister = time;
    this.data.user.userUpdate = "1";
    this.data.user.lastUpdate = time;
    this.data.user.photoUser = "1"; // Revisar si se pueden cargar imagenes

    this.lawyerService.saveLawyer(this.data)
    .subscribe(
      rs => {
        this.router.navigateByUrl("list-lawyers")
      },
      err => console.log(err)
    )
  }

  heightInfo() {
    let height: number = document.documentElement.clientHeight;

    const operationsElement = document.getElementById("info");

    if (operationsElement) operationsElement.style.maxHeight = `${height - 140}px`;
  }

}
