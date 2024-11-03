import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, Observable, startWith, switchMap } from 'rxjs';
import { CaseProcessService } from 'src/app/services/case-process.service';
import { CustomersService } from 'src/app/services/customers.service';
import { LawyersService } from 'src/app/services/lawyers.service';
import { Case, CaseLawyer, Notify } from 'src/app/services/model';
import { TimeActualService } from 'src/app/services/time-actual/time-actual.service';
import { AuthServiceService } from 'src/app/services/authService/auth-service.service';
import { DataService } from 'src/app/services/shared/data.service';
import { NotifyService } from 'src/app/services/notify.service';


@Component({
  selector: 'app-form-case-process',
  templateUrl: './form-case-process.component.html',
  styleUrls: ['./form-case-process.component.css']
})
export class FormCaseProcessComponent implements OnInit {

  form = new FormGroup({
    nameCase: new FormControl(""),
    descriptionCase: new FormControl("",[Validators.required]),
    dateInitCase: new FormControl("",[Validators.required]),
    dateEndCase: new FormControl("Sin definir",[Validators.required]),
    statusCase: new FormControl("Abierto"),
    typeCase: new FormControl("Penal"),
    nameClientSelect: new FormControl(""),
    idClient: new FormControl("",[Validators.required]),
    lawyers: new FormArray([]),
    confirmLawyer : new FormControl(false)
  });

  idCaseParam : string = ""; // Id Caso si es actualizar
  edit : boolean = false; // ¿Actualizar?

  inputType: string = "text";
  inputValue: string = "Sin definir";
  readonly: Boolean = true;
  idCase: number = 0;
  showSearchClient: boolean = false;
  showSearchLawyer: boolean = false;
  dataClient: any[] = [];
  dataLawyerList: any[] = [];
  openLawyer: number = -1;
  nameClientControl = new FormControl("");

  isNameValidation: boolean = false;
  isValidName: boolean = false;
  nameMessage: string = "";

  messageSubmit: string = "";

  nameCase : string = "";
  statusCase : string = "";

  constructor(private casesService: CaseProcessService, private router: Router,
    private customerService: CustomersService, private lawyerService: LawyersService, 
    private time: TimeActualService, private auth : AuthServiceService, 
    private dataService : DataService, private activatedRoute : ActivatedRoute,
    private notifyService : NotifyService) { }

  ngOnInit(): void {
    this.heightInfo();

    this.activatedRoute.paramMap.subscribe(params => {
      if (params.has("id")) {
        this.idCaseParam = params.get("id") || "";
        this.searchEditCase(this.idCaseParam);
      } else {
        this.addLawyer();
      }
    })

    const textarea = document.getElementById('descriptionCase') as HTMLTextAreaElement | null;

    if (textarea) {
      textarea.addEventListener('input', () => {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      });
    }

    const selectElement = document.getElementById('statusCase') as HTMLSelectElement | null;

    if (selectElement) {
      selectElement.addEventListener('change', (event: Event) => {
        const target = event.target as HTMLSelectElement;
        const selectedValue = target.value;

        if (selectedValue === "Abierto" || selectedValue === "Re Abierto") {
          this.inputType = "text";
          this.inputValue = "Sin definir";
          this.readonly = true;
        } else {
          this.inputType = "date";
          this.inputValue = "";
          this.readonly = false;
        }
      });
    }

    this.nameClientControl.valueChanges.pipe(
      debounceTime(300), // Esperar 300ms después de que el usuario deja de escribir
      distinctUntilChanged(),
      startWith(''),
      switchMap(name => this.searchCustomer(name))
    ).subscribe(
      data => {
        this.dataClient = data;
        this.showSearchClient = this.dataClient.length > 0; // Mostrar resultados si hay datos
      },
      error => {
        console.error('Error al buscar cliente:', error);
        this.showSearchClient = false;
      }
    );

    this.form.get("nameCase")?.valueChanges.pipe(
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
  }

  heightInfo() {
    let height: number = document.documentElement.clientHeight;

    const operationsElement = document.getElementById("info");

    if (operationsElement) operationsElement.style.maxHeight = `${height - 140}px`;
  }

  get lawyers() {
    return this.form.get('lawyers') as FormArray;
  }

  searchEditCase(id : string) {
    if (id) {
      this.casesService.getCaseProcessById(parseInt(id)).subscribe(
        rs => {
          this.form.get("nameCase")?.setValue(rs.nameCase);
          this.form.get("descriptionCase")?.setValue(rs.descriptionCase);
          this.form.get("dateInitCase")?.setValue(rs.dateInitCase);
          if (rs.statusCase == "Abierto" || rs.statusCase == "Re Abierto") {
            this.inputType = "text";
            this.inputValue = "Sin definir";
            this.readonly = true;
          } else {
            this.inputType = "date";
            this.inputValue = rs.dateEndCase || "";
            this.readonly = false;
          }
          this.form.get("statusCase")?.setValue(rs.statusCase);
          this.form.get("typeCase")?.setValue(rs.typeCase);
          this.form.get("nameClientSelect")?.setValue(`${rs.customer?.documentClient} - ${rs.customer?.nameClient}`);
          this.form.get("idClient")?.setValue(rs.customer?.idClient);
          this.edit = true;

          // Variables para notificación
          this.nameCase = rs.nameCase || "";
          this.statusCase = rs.statusCase || "";
        },
        err => console.log("Hubo un error al traer la información del caso" + err)
      )

      this.casesService.getCaseLawyerByIdCase(parseInt(id)).subscribe(
        rs => {
          let i = 0;
          if (rs.length === 0) { this.addLawyer(); } 
          for(let caseLawyer of rs) {
            this.addLawyer();
            let lawyersArray = this.form.get("lawyers") as FormArray;
            lawyersArray.at(i).get('selectLawyer')?.setValue(`${caseLawyer.documentLawyer} - ${caseLawyer.nameLawyer}`);
            lawyersArray.at(i).get('idLawyer')?.setValue(caseLawyer.idLawyer);
            i++;
          }
        },
        err => console.log("Hubo un error al traer la información de los abogado asignados al caso" + err)
      )
    }
  }

  searchCustomer(name: string): Observable<any[]> {
    if (name.length < 3) {
      this.showSearchClient = false; // No mostrar resultados si menos de 3 caracteres
      return new Observable(observer => observer.next([])); // Retornar un observable vacío
    }
    return this.customerService.getCustomerByName(name).pipe(
      map(customers => customers.slice(0, 5)) // Limitar a los primeros 5 resultados
    ); // Retornar el observable del servicio
  }

  selectClient(clientId: string, documentClient: string, nameClient: string) {
    this.form.get("idClient")?.setValue(clientId); // Establecer el ID del cliente seleccionado
    this.form.get("nameClientSelect")?.setValue(`${documentClient} - ${nameClient}`);
    this.showSearchClient = false; // Ocultar la lista de sugerencias
    this.nameClientControl.setValue(''); // Limpiar el campo de búsqueda
  }

  addLawyer() {
    const lawyerGroup = new FormGroup({
      nameLawyer: new FormControl(''),
      selectLawyer: new FormControl(''),
      idLawyer: new FormControl('',[Validators.required])
    });

    this.lawyers.push(lawyerGroup);
  }

  removeLawyer() {
    if (this.lawyers.length > 0) {
      this.lawyers.removeAt(this.lawyers.length - 1);
    }
  }

  onNameChange(i: number) {
    const nameControl = this.form.get(`lawyers.${i}.nameLawyer`) as FormControl;
    nameControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      startWith(''),
      switchMap(name => this.searchLawyer(name))
    ).subscribe(
      data => {
        this.dataLawyerList = data;
        this.openLawyer = i;
        this.showSearchLawyer = this.dataLawyerList.length > 0;
      },
      err => {
        console.log("Error al buscar el abogado:", err);
        this.showSearchLawyer = false;
      }
    )
  }

  searchLawyer(name: string): Observable<any[]> {
    if (name.length < 3) {
      this.showSearchLawyer = false;
      return new Observable(observer => observer.next([]));
    }
    return this.lawyerService.getLawyerByName(name).pipe(
      map(lawyers => lawyers.slice(0, 5))
    );
  }

  selectLawyer(lawyerId: string, lawyerDocument: string, lawyerName: string, i: number) {
    const lawyersArray = this.form.get("lawyers") as FormArray;
    lawyersArray.at(i).get('selectLawyer')?.setValue(`${lawyerDocument} - ${lawyerName}`);
    lawyersArray.at(i).get('idLawyer')?.setValue(lawyerId);
    lawyersArray.at(i).get("nameLawyer")?.setValue("");
    this.showSearchLawyer = false;
  }

  save() {
    if (!(this.isValidName && this.form.valid)) {
      this.messageSubmit = "Por favor, revisar que todos los campos esten debidamente diligenciados.";
      return;
    }

    let dataCase: Case = {
      nameCase: this.form.value.nameCase,
      descriptionCase: this.form.value.descriptionCase,
      dateInitCase: this.form.value.dateInitCase,
      dateEndCase: this.form.value.dateEndCase === "Sin definir" ? undefined : this.form.value.dateEndCase,
      statusCase: this.form.value.statusCase,
      userRegisterCase: !this.edit ? this.auth.getUser() : undefined,
      dateRegisterCase: !this.edit ? this.time.getTime() : undefined,
      updateUserCase: this.auth.getUser(),
      updateDateCase: this.time.getTime(),
      typeCase: this.form.value.typeCase,
      customer: {
        idClient: this.form.value.idClient
      }
    }

    this.casesService.saveCases(dataCase, this.edit, this.idCaseParam)
      .subscribe(
        rs => {
          let message = this.edit ? "actualizo" : "registro";
          this.idCase = this.edit ? parseInt(this.idCaseParam) : rs.data[0];
          
          // -------------------- Crear Notificación ----------------

          let typeNotify = this.edit ? "Editar" : "Nuevo";
          let descriptionNotify = "";

          if (!this.edit) {
            descriptionNotify = `Creó el caso ${this.form.value.nameCase} donde usted fue asignado.`
          }

          // Crear Descripción Notificación
          if(this.edit) {

            if (this.form.value.nameCase !== this.nameCase) {
              descriptionNotify = `Se cambió el nombre del caso ${this.nameCase} a ${this.form.value.nameCase}`;
              if (this.form.value.statusCase !== this.statusCase) {
                descriptionNotify += ` y cambió el estado de ${this.statusCase} a ${this.form.value.statusCase}`;
              }
            } else if (this.form.value.statusCase !== this.statusCase) {
              descriptionNotify = `Se cambió el estado del caso ${this.nameCase} de ${this.statusCase} a ${this.form.value.statusCase}`;
            } else {
              descriptionNotify = `Se modifico el caso ${this.nameCase}`;
            }
          }
          
          // JSON Notificación Para Enviar API
          let notify : Notify = {
            descriptionNotify: descriptionNotify,
            urlNotify: `case/${this.idCase}`,
            typeNotify: `${typeNotify} Caso`,
            dateRegister: this.time.getTime(),
            userRegister: this.auth.getUser(),
            notify: false
          }

          this.notifyService.createNotify(notify, this.idCase).subscribe(
            rs => console.log("OK"),
            err => console.log(err) 
          );

          if(!this.edit || this.form.value.confirmLawyer) {

            if(this.form.value.confirmLawyer) {
              this.casesService.deleteCaseLawyerByIdCase(this.idCase).subscribe(
                rs => { console.log("Se eliminaron los abogados asignados al caso.") },
                err => {
                  console.log("Hubo un error al eliminar los abogados del caso" + err);
                  return;
                }
              );
            }

          const lawyersData = this.form.value.lawyers;

          const saveLawyersRequest = lawyersData.map((element: any) => {
            let caseLawyer: CaseLawyer = {
              dateRegisterLawyer: this.time.getTime(),
              userRegisterLawyer: this.auth.getUser(),
              statusLawyerCase: "1",
              idLawyer: element.idLawyer,
              idCase: `${this.idCase}`
            }
            return this.casesService.addCaseLawyer(caseLawyer).toPromise();
          });

          Promise.all(saveLawyersRequest)
            .then(
              rs => {
                this.dataService.changeMessage(true, `Se ${message} el caso con exito.`);

                if(this.form.value.confirmLawyer) {
                  notify.descriptionNotify = "Se cambiaron los abogados asignados a: ";

                  lawyersData.map((element : any) => {
                    notify.descriptionNotify += element.selectLawyer + ",";
                  });

                  notify.descriptionNotify = notify.descriptionNotify.slice(0,-1);
                  notify.descriptionNotify += ` del caso ${this.nameCase}`;

                  this.notifyService.createNotify(notify, this.idCase).subscribe(
                    rs => this.router.navigate(['/case',this.idCase]),
                    err => console.log(err)
                  );
                } else {
                  this.router.navigate(['/case',this.idCase])
                }
              }
            )
            .catch(
              err => console.log("Error al asignar abogados", err)
            )
          } else {
            this.dataService.changeMessage(true, `Se ${message} el caso con exito.`);
            this.router.navigate(['/case',this.idCase]);
          }


        },
        err => console.log(err)
      );
  }
}