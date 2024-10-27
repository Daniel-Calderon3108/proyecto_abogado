import { Component, OnInit } from '@angular/core';
import { LawyersService } from 'src/app/services/lawyers.service';
import { Lawyers } from 'src/app/services/model';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { TimeActualService } from 'src/app/services/time-actual/time-actual.service';
import { debounceTime, distinctUntilChanged, map, Observable, switchMap } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-form-lawyer',
  templateUrl: './form-lawyer.component.html',
  styleUrls: ['./form-lawyer.component.css']
})
export class FormLawyerComponent implements OnInit {

  form = new FormGroup({
    nameLawyer: new FormControl(""),
    phoneLawyer: new FormControl(""),
    emailLawyer: new FormControl(""),
    typeLawyer: new FormControl("Penal"),
    typeDocumentLawyer: new FormControl("Cedula Ciudadania"),
    documentLawyer: new FormControl(""),
    nameUser: new FormControl(""),
    passwordUser: new FormControl("")
  });

  isNameValidation: boolean = false;
  isValidName: boolean = false;
  nameMessage: string = "";

  isPhoneValidation: boolean = false;
  isValidPhone: boolean = false;
  phoneMessage: string = "";

  isEmailValidation: boolean = false;
  isValidEmail: boolean = false;
  emailMessage: string = "";

  isDocumentValidation: boolean = false;
  isValidDocument: boolean = false;
  documentMessage: string = "";

  isUserValidation: boolean = false;
  isValidUser: boolean = false;
  userMessage: string = "";

  isPasswordValidation: boolean = false;
  isValidPassword: boolean = false;
  passwordMessage: string = "";

  messageSubmit: string = "";

  constructor(private lawyerService: LawyersService, private router: Router,
     private time: TimeActualService, private userService : UserService) { }

  ngOnInit(): void {
    this.heightInfo();
    // Validar Nombre Abogado
    this.form.get("nameLawyer")?.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      map(name => {
        this.isNameValidation = true;
        this.isValidName = false;
        this.nameMessage = '';

        const rules = [
          { test: (name: string) => !!name, message: 'El campo nombre no puede estar vacío.' },
          { test: (name: string) => name.length >= 8, message: 'El nombre debe tener al menos 8 caracteres.' },
          { test: (name: string) => !/[^a-zA-Z0-9\s]+$/.test(name), message: 'El nombre no puede contener caracteres especiales.' },
        ];

        for (const rule of rules) {
          if (!rule.test(name)) {
            this.nameMessage = rule.message;
            this.isValidName = false;
            return;
          }
        }

        this.nameMessage = 'Nombre Válido';
        this.isValidName = true;
      })
    )
      .subscribe();
    // Validar Teléfono Abogado
    this.form.get("phoneLawyer")?.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      map(phone => {
        this.isPhoneValidation = true;
        this.isValidPhone = false;
        this.phoneMessage = '';

        const rules = [
          { test: (phone: string) => !!phone, message: 'El campo teléfono no puede estar vacío.' },
          { test: (phone: string) => /^[0-9]+$/.test(phone), message: 'El teléfono debe estar compuesto por números y sin espacios, ni puntos.' },
        ];

        for (const rule of rules) {
          if (!rule.test(phone)) {
            this.phoneMessage = rule.message;
            this.isValidPhone = false;
            return;
          }
        }

        this.phoneMessage = 'Télefono Válido';
        this.isValidPhone = true;
      })
    )
      .subscribe();
    // Validar Correo Abogado
    this.form.get("emailLawyer")?.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      map(email => {
        this.isEmailValidation = true;
        this.isValidEmail = false;
        this.emailMessage = '';

        const rules = [
          { test: (email: string) => !!email, message: 'El campo correo no puede estar vacío.' },
          { test: (email: string) => /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(email), message: 'El correo debe ser uno existente.' },
        ];

        for (const rule of rules) {
          if (!rule.test(email)) {
            this.emailMessage = rule.message;
            this.isValidEmail = false;
            return;
          }
        }

        this.emailMessage = 'Correo Válido';
        this.isValidEmail = true;
      })
    )
      .subscribe();
    // Validar Documennto Abogado
    this.form.get("documentLawyer")?.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(document => {
        this.isDocumentValidation = true;
        this.isValidDocument = false;
        this.documentMessage = '';

        const rules = [
          { test: (document: string) => !!document, message: 'El campo documento no puede estar vacío.' },
          { test: (document: string) => /^[0-9]+$/.test(document), message: 'El documento debe estar compuesto por números y sin espacios, ni puntos.' },
        ];

        for (const rule of rules) {
          if (!rule.test(document)) {
            this.documentMessage = rule.message;
            this.isValidDocument = false;
            return [];
          }
        }

        this.isValidDocument = true;
        return this.searchDocument(document);
      })
    )
      .subscribe(document => {
        // Validar Disponibilidad Documento
        if (document) {
          this.documentMessage = 'Este documento ya esta registrado.';
          this.isValidDocument = false;
        } else if (this.isValidDocument) { this.documentMessage = 'Documento Válido.'; }
      });
    // Validar Usuario
    this.form.get("nameUser")?.valueChanges.pipe(
      debounceTime(300), // Espera 300ms después de que el usuario deja de escribir
      distinctUntilChanged(), // Evita procesar valores idénticos consecutivamente
      switchMap(user => {
        // Resetear la validación y mensajes antes de cada cambio
        this.isUserValidation = true;
        this.isValidUser = false;
        this.userMessage = '';

        const rules = [
          { test: (user: string) => !!user, message: 'El campo usuario no puede estar vacío.' },
          { test: (user: string) => user.length >= 5, message: 'El usuario debe tener al menos 5 caracteres.' },
          { test: (user: string) => !/[^a-zA-Z0-9]/.test(user), message: 'El usuario no puede contener caracteres especiales, ni espacios.' }
        ];

        for (const rule of rules) {
          if (!rule.test(user)) {
            this.userMessage = rule.message;
            this.isValidUser = false;
            return [];
          }
        }
        this.isValidUser = true;
        return this.searchUser(user);
      })
    ).subscribe(user => {
      // Verificar disponibilidad del usuario
      if (user) {
        this.userMessage = 'Este usuario está ocupado.';
        this.isValidUser = false;
      } else if (this.isValidUser) { this.userMessage = 'Usuario Válido.'; }
    });
    // Validar Clave
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
  // Buscar Documento
  searchDocument(document: string): Observable<any[]> {
    if (document === "") {
      return new Observable(observer => observer.next([]));
    }
    return this.lawyerService.getLawyerByDocument(document);
  }
  // Buscar Usuario
  searchUser(user : string) : Observable<any[]> {
    if (user === "") {
      return new Observable(observer => observer.next([]));
    }
    return this.userService.getUserByName(user);
  }
  // Guardar Abogado
  save() {
    // Validar que los campos esten debidamente diligenciados
    if (!(this.isValidName && this.isValidPhone && this.isValidEmail && this.isValidDocument
      && this.isValidUser && this.isValidPassword
    )) {
      this.messageSubmit = "Por favor, revisar que todos los campos esten debidamente diligenciados.";
      return;
    }
    // Crear JSON para peticion con los datos ingresados por usuario
    let lawyer: Lawyers = {
      nameLawyer: this.form.value.nameLawyer,
      phoneLawyer: this.form.value.phoneLawyer,
      emailLawyer: this.form.value.emailLawyer,
      typeLawyer: this.form.value.typeLawyer,
      userRegisterLawyer: "Administrador",
      dateRegisterLawyer: this.time.getTime(),
      userUpdateLawyer: "Administrador",
      dateUpdateLawyer: this.time.getTime(),
      typeDocumentLawyer: this.form.value.typeDocumentLawyer,
      documentLawyer: this.form.value.documentLawyer,
      statusLawyer: true,
      user: {
        nameUser: this.form.value.nameUser,
        passwordUser: this.form.value.passwordUser,
        userRegister: "Administrador",
        dateRegister: this.time.getTime(),
        userUpdate: "Administrador",
        lastUpdate: this.time.getTime(),
        photoUser: "Ninguna",
        statusUser: true,
        rolUser: "Abogado",
      }
    };

    this.lawyerService.saveLawyer(lawyer)
      .subscribe(
        rs => this.router.navigateByUrl("list-lawyers"),
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
