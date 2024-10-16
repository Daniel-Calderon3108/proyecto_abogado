import { Component, OnInit } from '@angular/core';
import { CustomersService } from 'src/app/services/customers.service';
import { Customers } from 'src/app/services/model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-form-customers',
  templateUrl: './form-customers.component.html',
  styleUrls: ['./form-customers.component.css']
})
export class FormCustomersComponent implements OnInit {

  // Inicializar variable
  data: Customers = {
    nameClient: "",
    addressClient: "",
    phoneClient: "",
    emailClient: "",
    typeClient: "Natural",
    userRegisterClient: "",
    dateRegisterClient: "",
    updateUserClient: "",
    dateUpdateClient: "",
    typeDocumentClient: "Cedula Ciudadania",
    documentClient: "",
    statusClient: true,
    user: {
        id_user: "",
        nameUser: "",
        passwordUser: "",
        userRegister: "",
        dateRegister: "",
        userUpdate: "",
        lastUpdate: "",
        photoUser: "",
        statusUser: true,
        rolUser: "Usuario"
    }
  };


  constructor(private customerService: CustomersService, private router: Router, private activatedRoute: ActivatedRoute) { }

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

    delete this.data.id_client;
    this.data.userRegisterClient = "1"; // Se debe cambiar por el usuario que este logeado (Administrador)
    this.data.dateRegisterClient = time;
    this.data.updateUserClient = "1"; // Se debe cambiar por el usuario que este logeado (Administrador)
    this.data.dateUpdateClient = time;

    delete this.data.user.id_user;
    this.data.user.userRegister = "1"; // Se debe cambiar por el usuario que este logeado (Administrador)
    this.data.user.dateRegister = time;
    this.data.user.userUpdate = "1"; // Se debe cambiar por el usuario que este logeado (Administrador)
    this.data.user.lastUpdate = time; 
    this.data.user.photoUser = "Ninguna"; // Revisar si se pueden cargar imagenes

    this.customerService.saveCustomer(this.data)
      .subscribe(
        rs => {
          this.router.navigateByUrl("list-customers");
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
