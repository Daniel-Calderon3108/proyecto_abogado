import { Component, OnInit } from '@angular/core';
import { LawyersService } from 'src/app/services/lawyers.service';
import { Lawyers, User } from 'src/app/services/model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { TimeActualService } from 'src/app/services/time-actual/time-actual.service';
import { debounceTime, distinctUntilChanged, map, Observable, switchMap } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { AuthServiceService } from 'src/app/services/authService/auth-service.service';
import { DataService } from 'src/app/services/shared/data.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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
    statusLawyer: new FormControl(""),
    nameUser: new FormControl(""),
    passwordUser: new FormControl(""),
    statusUser: new FormControl("")
  });

  idLawyer: string = ""; // Id Abogado si es actualizar
  nameUser: string = ""; // Nombre Usuario si es actualizar
  document: string = ""; // Documento si es actualizar
  labelPass: string = "Clave"; // Se cambia el valor si es registrar o actualizar
  edit: boolean = false; // ¿Actualizar?
  fileActual: string = "";
  title : string = "Nuevo Abogado";

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

  selectedFile: File | null = null;
  filePreviewUrl: SafeResourceUrl = 'assets/no-user.webp';

  constructor(private lawyerService: LawyersService, private router: Router,
    private time: TimeActualService, private userService: UserService,
    private activatedRoute: ActivatedRoute, private auth: AuthServiceService,
    private dataService: DataService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe(params => {
      if (params.has("id")) {
        this.idLawyer = params.get("id") || "";
        this.searchEditLawyer(this.idLawyer);
      }
    });

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
          if (this.document === document?.documentLawyer) {
            this.documentMessage = 'Documento Válido.';
            return;
          }
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
        if (this.nameUser == user?.nameUser) {
          this.userMessage = 'Usuario Válido.';
          return;
        }
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

        if (!(this.edit && password === "")) {
          for (const rule of rules) {
            if (!rule.test(password)) {
              this.passwordMessage = rule.message;
              this.isValidPassword = false;
              return;
            }
          }
        } else {
          this.passwordMessage = 'No se realizara cambios en la clave.';
          this.isValidPassword = true;
          return;
        }

        this.passwordMessage = 'Clave Válida.';
        this.isValidPassword = true;
      })
    ).subscribe();
  }
  // Buscar Abogado Actualizar
  searchEditLawyer(id: string) {
    if (id) {
      this.lawyerService.getLawyerByID(parseInt(id)).subscribe(
        rs => {
          this.form.get("nameLawyer")?.setValue(rs.nameLawyer);
          this.form.get("phoneLawyer")?.setValue(rs.phoneLawyer);
          this.form.get("emailLawyer")?.setValue(rs.emailLawyer);
          this.form.get("typeLawyer")?.setValue(rs.typeLawyer);
          this.form.get("typeDocumentLawyer")?.setValue(rs.typeDocumentLawyer);
          this.form.get("documentLawyer")?.setValue(rs.documentLawyer);
          this.form.get("statusLawyer")?.setValue(rs.statusLawyer);
          this.form.get("nameUser")?.setValue(rs.nameUser);
          this.form.get("statusUser")?.setValue(rs.statusUser);
          this.nameUser = rs.nameUser || "";
          this.document = rs.documentLawyer || "";
          this.labelPass = "Nueva Clave (Opcional)";
          this.edit = true;
          this.isValidPassword = true;
          this.title = "Editar Abogado";
          if(rs.photoUser && rs.photoUser !== 'Ninguna') {
            const url = `${origin.replace('4200', '8080')}/api/user/searchPhoto/${rs.photoUser}`;
            this.filePreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
            this.fileActual = rs.photoUser;
          } else {
            this.fileActual = 'assets/no-user.webp';
          }
        },
        err => console.log("Hubo un error al traer información del abogado" + err)
      )
    }
  }
  // Buscar Documento
  searchDocument(document: string): Observable<Lawyers> {
    if (document === "") {
      return new Observable(observer => observer.next());
    }
    return this.lawyerService.getLawyerByDocument(document);
  }
  // Buscar Usuario
  searchUser(user: string): Observable<User> {
    if (user === "") {
      return new Observable(observer => observer.next());
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
      userRegisterLawyer: this.edit ? undefined : this.auth.getUser(),
      dateRegisterLawyer: this.edit ? undefined : this.time.getTime(),
      userUpdateLawyer: this.auth.getUser(),
      dateUpdateLawyer: this.time.getTime(),
      typeDocumentLawyer: this.form.value.typeDocumentLawyer,
      documentLawyer: this.form.value.documentLawyer,
      statusLawyer: this.edit ? this.form.value.statusLawyer : true,
      user: {
        nameUser: this.form.value.nameUser,
        passwordUser: this.form.value.passwordUser === "" && this.edit ? undefined : this.form.value.passwordUser,
        userRegister: this.edit ? undefined : this.auth.getUser(),
        dateRegister: this.edit ? undefined : this.time.getTime(),
        userUpdate: this.auth.getUser(),
        lastUpdate: this.time.getTime(),
        statusUser: this.edit ? this.form.value.statusUser : true,
        rolUser: "Abogado",
      }
    };

    const formData = new FormData();
    if (this.selectedFile) formData.append('file', this.selectedFile);

    if (this.selectedFile) {
      this.userService.uploadPhoto(formData).subscribe(
        rs => {
          if (rs.success) {
            lawyer.user.photoUser = rs.singleData;

            this.lawyerService.saveLawyer(lawyer, this.edit, this.idLawyer)
              .subscribe(
                rs => {
                  let message = this.edit ? "actualizo" : "registro"
                  this.dataService.changeMessage(true, `Se ${message} el abogado con exito.`);
                  this.router.navigate(['/lawyer', rs.singleData]);
                },
                err => console.log(err)
              )
          } else {
            console.log(rs.message)
          }
        },
        err => console.log(err)
      )
    } else {
      lawyer.user.photoUser = this.edit ? this.fileActual : "Ninguna";

      this.lawyerService.saveLawyer(lawyer, this.edit, this.idLawyer)
        .subscribe(
          rs => {
            let message = this.edit ? "actualizo" : "registro"
            this.dataService.changeMessage(true, `Se ${message} el abogado con exito.`);
            this.router.navigate(['/lawyer', rs.singleData]);
          },
          err => console.log(err)
        )
    }
  }
  // Obtener alto maximo
  heightInfo() {
    let height: number = document.documentElement.clientHeight;
    const operationsElement = document.getElementById("info");
    if (operationsElement) operationsElement.style.maxHeight = `${height - 150}px`;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        const fileResult = reader.result as string;
        if (this.selectedFile?.type.startsWith('image/')) {
          this.filePreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fileResult);
        }
      };

      reader.readAsDataURL(this.selectedFile);
    } else {
      this.resetPreview();
    }
  }

  resetPreview() {
    this.selectedFile = null;
    this.filePreviewUrl = 'assets/no-user.webp';
  }
}
