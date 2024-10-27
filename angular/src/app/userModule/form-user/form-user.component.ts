import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/services/model';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { TimeActualService } from 'src/app/services/time-actual/time-actual.service';
import { debounceTime, distinctUntilChanged, map, Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-form-user',
  templateUrl: './form-user.component.html',
  styleUrls: ['./form-user.component.css']
})
export class FormUserComponent implements OnInit {

  form = new FormGroup({
    nameUser: new FormControl(""),
    passwordUser: new FormControl(""),
    photoUser: new FormControl("Ninguna"),
    rolUser: new FormControl("Usuario")
  });

  isNameValidation: boolean = false;
  isValidName : boolean = false;
  nameMessage : string = "";

  isPasswordValidation: boolean = false;
  isValidPassword : boolean = false;
  passwordMessage : string = "";

  messageSubmit : string = "";

  constructor(private userService: UserService, private router: Router, private time: TimeActualService) { }

  ngOnInit(): void {
    this.heightInfo();
    // Validar Nombre de Usuario
    this.form.get("nameUser")?.valueChanges.pipe(
      debounceTime(300), // Espera 300ms después de que el usuario deja de escribir
      distinctUntilChanged(), // Evita procesar valores idénticos consecutivamente
      switchMap(name => {
        // Resetear la validación y mensajes antes de cada cambio
        this.isNameValidation = true;
        this.isValidName = false;
        this.nameMessage = '';

        const rules = [
          { test: (name: string) => !!name, message: 'El campo usuario no puede estar vacío.' },
          { test: (name: string) => name.length >= 5, message: 'El usuario debe tener al menos 5 caracteres.' },
          { test: (name: string) => !/[^a-zA-Z0-9]/.test(name), message: 'El usuario no puede contener caracteres especiales, ni espacios.' }
        ];

        for (const rule of rules) {
          if (!rule.test(name)) {
            this.nameMessage = rule.message;
            this.isValidName = false;
            return [];
          }
        }
        this.isValidName = true;
        return this.searchUser(name);
      })
    ).subscribe(user => {
      // Verificar disponibilidad del usuario
      if (user) {
        this.nameMessage = 'Este usuario está ocupado.';
        this.isValidName = false;
      } else if (this.isValidName) { this.nameMessage = 'Usuario Válido.'; }
    });
    // Validar Clave Usuario
    this.form.get("passwordUser")?.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      map(password => { // Map Si no se necesita realizar solicitud HTTP, switchMap, si se requiere
        this.isPasswordValidation = true;
        this.isValidPassword = false;
        this.passwordMessage = '';
    
        // Reglas de validación
        const rules = [
          { test: (pwd: string) => !!pwd, message: 'El campo clave no puede estar vacío.' },
          { test: (pwd: string) => pwd.length >= 8, message: 'La clave debe tener al menos 8 caracteres.' },
          { test: (pwd: string) => /[A-Z]/.test(pwd), message: 'La clave debe contener al menos una mayúscula.' },
          { test: (pwd: string) => /[a-z]/.test(pwd), message: 'La clave debe contener al menos una minúscula.' },
          { test: (pwd: string) => /\d/.test(pwd), message: 'La clave debe contener al menos un número.' },
          { test: (pwd: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd), message: 'La clave debe contener al menos un carácter especial.' }
        ];
    
        for (const rule of rules) {
          if (!rule.test(password)) {
            this.passwordMessage = rule.message;
            this.isValidPassword = false;
            return;
          }
        }
    
        this.passwordMessage = 'Clave Válida.';
        this.isValidPassword = true;
      })
    ).subscribe();
  }
  // Buscar Nombre Usuario
  searchUser(name : string) : Observable<any[]> {
    if (name === "") {
      return new Observable(observer => observer.next([]));
    }
    return this.userService.getUserByName(name);
  }
  // Salvar Usuario
  save() {
    // Validar que los campos esten debidamente diligenciados
    if(!(this.isValidName && this.isValidPassword)) {
      this.messageSubmit = "Por favor, revisar que todos los campos esten debidamente diligenciados.";
      return;
    }
    // Crear JSON para peticion con los datos ingresados por usuario
    let user: User = {
      nameUser: this.form.value.nameUser,
      passwordUser: this.form.value.passwordUser,
      userRegister: "Administrador",
      dateRegister: this.time.getTime(),
      userUpdate: "Administrador",
      lastUpdate: this.time.getTime(),
      photoUser: this.form.value.photoUser,
      statusUser: true,
      rolUser: this.form.value.rolUser
    }

    this.userService.saveUser(user)
      .subscribe(
        rs => this.router.navigateByUrl("list-users"),
        err => console.log(err)
      )
  }
  // Obtener alto maximo
  heightInfo() {
    let height: number = document.documentElement.clientHeight;
    const operationsElement = document.getElementById("info");
    if (operationsElement) operationsElement.style.maxHeight = `${height - 140}px`;
  }
}
