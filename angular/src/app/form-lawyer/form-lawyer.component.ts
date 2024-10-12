import { Component, OnInit } from '@angular/core';
import { Lawyers } from '../services/model';
import { LawyersService } from '../services/lawyers.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-form-lawyer',
  templateUrl: './form-lawyer.component.html',
  styleUrls: ['./form-lawyer.component.css']
})
export class FormLawyerComponent implements OnInit {

  // Inicializar variable
  data: Lawyers = {
    abogado_id: "",
    nombre: "",
    telefono: "",
    correo: "",
    especialidad: "Penal",
    usuario_registra: "",
    fecha_registra: "",
    usuario_actualiza: "",
    fecha_actualiza: "",
    tipo_documento: "Cedula Ciudadania",
    documento: "",
    usuario: {
      usuario_id: "",
      nombre: "",
      clave: "",
      usuario_registra: "",
      fecha_registra: "",
      usuario_actualiza: "",
      fecha_actualiza: "",
      avatar: ""
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

    delete this.data.abogado_id;
    this.data.usuario_registra = "1"; // Se debe cambiar por el usuario que este logeado (Administrador)
    this.data.fecha_registra = time;
    this.data.usuario_actualiza = "1"; // Se debe cambiar por el usuario que este logeado (Administrador)
    this.data.fecha_actualiza = time;

    delete this.data.usuario.usuario_id;
    this.data.usuario.usuario_registra = "1";
    this.data.usuario.fecha_registra = time;
    this.data.usuario.usuario_actualiza = "1";
    this.data.usuario.fecha_actualiza = time;
    this.data.usuario.avatar = "1"; // Revisar si se pueden cargar imagenes

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
