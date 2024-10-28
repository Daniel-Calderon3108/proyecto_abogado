import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, Observable, startWith, switchMap } from 'rxjs';
import { CaseProcessService } from 'src/app/services/case-process.service';
import { CustomersService } from 'src/app/services/customers.service';
import { LawyersService } from 'src/app/services/lawyers.service';
import { Case, CaseLawyer } from 'src/app/services/model';
import { TimeActualService } from 'src/app/services/time-actual/time-actual.service';
import { AuthServiceService } from 'src/app/services/authService/auth-service.service';


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
    lawyers: new FormArray([])
  });

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

  constructor(private casesService: CaseProcessService, private router: Router,
    private customerService: CustomersService, private lawyerService: LawyersService, 
    private time: TimeActualService, private auth : AuthServiceService) { }

  ngOnInit(): void {
    this.heightInfo();
    this.addLawyer();

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
      userRegisterCase: this.auth.getUser(),
      dateRegisterCase: this.time.getTime(),
      updateUserCase: this.auth.getUser(),
      updateDateCase: this.time.getTime(),
      typeCase: "Penal",
      customer: {
        idClient: this.form.value.idClient
      }
    }

    this.casesService.saveCases(dataCase)
      .subscribe(
        rs => {
          this.idCase = rs.data[0];

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
              rs => this.router.navigate(['/case',this.idCase])
            )
            .catch(
              err => console.log("Error al asignar abogados", err)
            )
        },
        err => console.log(err)
      );
  }
}