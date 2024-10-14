import { Component, OnInit } from '@angular/core';
import { User } from '../services/model';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-form-user',
  templateUrl: './form-user.component.html',
  styleUrls: ['./form-user.component.css']
})
export class FormUserComponent implements OnInit {

  data : User = {
    id_user: "",
    nameUser: "",
    passwordUser: "",
    userRegister: "",
    dateRegister: "",
    userUpdate: "",
    lastUpdate: "",
    photoUser: "Ninguna",
    statusUser: true,
    rolUser: "Usuario"
  }

  constructor(private userService : UserService, private router : Router, private activatedRoute : ActivatedRoute) { }

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

    delete this.data.id_user;
    this.data.userRegister = "1";
    this.data.dateRegister = time;
    this.data.userUpdate = "1";
    this.data.lastUpdate = time;

    this.userService.saveUser(this.data)
    .subscribe(
      rs => {
        this.router.navigateByUrl("list-users");
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
