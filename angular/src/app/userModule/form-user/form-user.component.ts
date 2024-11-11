import { Component, OnInit } from '@angular/core';
import { ApiResponse, User } from 'src/app/services/model';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { TimeActualService } from 'src/app/services/time-actual/time-actual.service';
import { debounceTime, distinctUntilChanged, map, Observable, switchMap } from 'rxjs';
import { AuthServiceService } from 'src/app/services/authService/auth-service.service';
import { DataService } from 'src/app/services/shared/data.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

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
    rolUser: new FormControl("Usuario"),
    statusUser: new FormControl("")
  });

  idUser: string = ""; // Id User si es actualizar
  nameUser: string = ""; // Nombre Usuario si es actualizar
  labelPass: string = "Clave"; // Se cambia valor si es registrar o actualizar
  edit: boolean = false; // ¿Actualizar?
  fileActual: string = "";
  title : string = "Nuevo Usuario";

  isNameValidation: boolean = false;
  isValidName: boolean = false;
  nameMessage: string = "";

  isPasswordValidation: boolean = false;
  isValidPassword: boolean = false;
  passwordMessage: string = "";

  messageSubmit: string = "";

  selectedFile: File | null = null;
  filePreviewUrl: SafeResourceUrl = 'assets/no-user.webp';

  constructor(private userService: UserService, private router: Router,
    private time: TimeActualService, private activatedRoute: ActivatedRoute,
    private auth: AuthServiceService, private dataService: DataService,
    private sanitizer: DomSanitizer, private http : HttpClient) { }

  ngOnInit(): void {
    this.heightInfo();

    this.activatedRoute.paramMap.subscribe(params => {
      if (params.has("id")) {
        this.idUser = params.get("id") || "";
        this.searchEditUser(this.idUser);
      }
    })

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
        if (this.nameUser == user?.nameUser) {
          this.nameMessage = 'Usuario Válido.';
          return;
        }
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
  // Buscar Usuario Actualizar
  searchEditUser(id: string) {
    if (id) {
      this.userService.getUserById(id).subscribe(
        rs => {
          this.form.get("nameUser")?.setValue(rs.nameUser);
          this.form.get("rolUser")?.setValue(rs.rolUser);
          this.form.get("statusUser")?.setValue(rs.statusUser);
          this.nameUser = rs.nameUser || "";
          this.labelPass = "Nueva Clave (Opcional)";
          this.edit = true;
          this.isValidPassword = true;
          this.title = "Editar Usuario";
          if (rs.photoUser && rs.photoUser !== 'Ninguna') {
            const url = `${origin.replace('4200', '8080')}/api/user/searchPhoto/${rs.photoUser}`;
            this.http.get(url, { responseType: 'blob' }).subscribe(
              rs => {
                const imageUrl = URL.createObjectURL(rs);
                this.filePreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(imageUrl);
              },
              err => console.log(err)
            );
            this.fileActual = rs.photoUser;
          } else {
            this.fileActual = 'assets/no-user.webp';
          }
        },
        err => console.log("Hubo un error al traer información del usuario" + err)
      );
    }
  }
  // Buscar Nombre Usuario
  searchUser(name: string): Observable<User> {
    if (name === "") {
      return new Observable(observer => observer.next());
    }
    return this.userService.getUserByName(name);
  }
  // Salvar Usuario
  save() {
    // Validar que los campos esten debidamente diligenciados
    if (!(this.isValidName && this.isValidPassword)) {
      this.messageSubmit = "Por favor, revisar que todos los campos esten debidamente diligenciados.";
      return;
    }
    // Crear JSON para peticion con los datos ingresados por usuario
    let user: User = {
      nameUser: this.form.value.nameUser,
      passwordUser: this.form.value.passwordUser === "" && this.edit ? undefined : this.form.value.passwordUser,
      userRegister: this.edit ? undefined : this.auth.getUser(),
      dateRegister: this.edit ? undefined : this.time.getTime(),
      userUpdate: this.auth.getUser(),
      lastUpdate: this.time.getTime(),
      statusUser: this.edit ? this.form.value.statusUser : true,
      rolUser: this.form.value.rolUser
    }

    const formData = new FormData();
    if (this.selectedFile) formData.append('file', this.selectedFile);

    if (this.selectedFile) {
      this.userService.uploadPhoto(formData).subscribe(
        rs => {
          if (rs.success) {
            user.photoUser = rs.singleData;

            this.userService.saveUser(user, this.edit, this.idUser)
              .subscribe(
                rs => {
                  let message = this.edit ? "actualizo" : "registro";
                  this.dataService.changeMessage(true, `Se ${message} el usuario con exito.`);
                  this.router.navigate(['user', rs.singleData])
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
      user.photoUser = this.edit ? this.fileActual : "Ninguna";

      this.userService.saveUser(user, this.edit, this.idUser)
        .subscribe(
          rs => {
            let message = this.edit ? "actualizo" : "registro";
            this.dataService.changeMessage(true, `Se ${message} el usuario con exito.`);
            this.router.navigate(['user', rs.singleData])
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
