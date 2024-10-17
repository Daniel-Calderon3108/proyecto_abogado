import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { debounceTime, map, Observable, startWith, switchMap } from 'rxjs';
import { CaseProcessService } from 'src/app/services/case-process.service';
import { CustomersService } from 'src/app/services/customers.service';
import { LawyersService } from 'src/app/services/lawyers.service';
import { Case, CaseLawyer } from 'src/app/services/model';


@Component({
  selector: 'app-form-case-process',
  templateUrl: './form-case-process.component.html',
  styleUrls: ['./form-case-process.component.css']
})
export class FormCaseProcessComponent implements OnInit {

  form = new FormGroup({
    nameCase: new FormControl(""),
    descriptionCase: new FormControl(""),
    dateInitCase: new FormControl(""),
    dateEndCase: new FormControl("Sin definir"),
    statusCase: new FormControl("Abierto"),
    userRegisterCase: new FormControl(""),
    dateRegisterCase: new FormControl(""),
    updateUserCase: new FormControl(""),
    updateDateCase: new FormControl(""),
    typeCase: new FormControl("Penal"),
    idClient: new FormControl(""),
    lawyers: new FormArray([])
  });

  dataCase: Case = {
    idCase: "",
    nameCase: "",
    descriptionCase: "",
    dateInitCase: "",
    dateEndCase: "Sin definir",
    statusCase: "Abierto",
    userRegisterCase: "",
    dateRegisterCase: "",
    updateUserCase: "",
    updateDateCase: "",
    typeCase: "Penal",
    customer: {
      idClient: ""
    }
  }

  dataLawyer: CaseLawyer = {
    idCaseLawyer: "",
    dateRegisterLawyer: "",
    userRegisterLawyer: "",
    statusLawyerCase: "1",
    idLawyer: "",
    idCase: ""
  }

  inputType: string = "text";
  inputValue: string = "Sin definir";
  readonly: Boolean = true;
  idCase: number = 0;
  showSearchClient : boolean = false;
  showSearchLawyer : boolean = false;
  dataClient : any[] = [];
  dataLawyerList : any[] = [];
  openLawyer : number = -1;
  nameClientControl = new FormControl();


  constructor(private casesService: CaseProcessService, private router: Router, private activatedRoute: ActivatedRoute, 
    private customerService : CustomersService, private lawyerService : LawyersService) { }

  ngOnInit(): void {
    const param = this.activatedRoute.snapshot;
    this.heightInfo();

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

  }

  heightInfo() {
    let height: number = document.documentElement.clientHeight;

    const operationsElement = document.getElementById("info");

    if (operationsElement) operationsElement.style.maxHeight = `${height - 140}px`;
  }

  get lawyers() {
    return this.form.get('lawyers') as FormArray;
  }

  searchCustomer(name : string) : Observable<any[]>  {
    if (name.length < 3) {
      this.showSearchClient = false; // No mostrar resultados si menos de 3 caracteres
      return new Observable(observer => observer.next([])); // Retornar un observable vacío
    }
    return this.customerService.getCustomerByName(name).pipe(
      map(customers => customers.slice(0, 5)) // Limitar a los primeros 5 resultados
    ); // Retornar el observable del servicio
  }

  selectClient(clientId: string) {
    this.form.get("idClient")?.setValue(clientId); // Establecer el ID del cliente seleccionado
    this.showSearchClient = false; // Ocultar la lista de sugerencias
    this.nameClientControl.setValue(''); // Limpiar el campo de búsqueda
  }

  addLawyer() {
    const lawyerGroup = new FormGroup({
      nameLawyer: new FormControl(''),
      idLawyer: new FormControl('')
    });

    this.lawyers.push(lawyerGroup);
  }

  removeLawyer() {
    if (this.lawyers.length > 0) {
      this.lawyers.removeAt(this.lawyers.length - 1);
    }

  }

  onNameChange(i : number) {
    const nameControl = this.form.get(`lawyers.${i}.nameLawyer`) as FormControl;
    nameControl.valueChanges.pipe(
      debounceTime(300),
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

  searchLawyer(name : string): Observable<any[]> {
    if (name.length < 3) {
      this.showSearchLawyer = false;
      return new Observable(observer => observer.next([]));
    }
    return this.lawyerService.getLawyerByName(name).pipe(
      map(lawyers => lawyers.slice(0,5))
    );
  }

  selectLawyer(lawyerId : string, i : number) {
    const lawyersArray = this.form.get("lawyers") as FormArray;
    lawyersArray.at(i).get('idLawyer')?.setValue(lawyerId);
    lawyersArray.at(i).get("nameLawyer")?.setValue("");
    this.showSearchLawyer = false;
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

    delete this.dataCase.idCase;
    this.dataCase.nameCase = this.form.value.nameCase;
    this.dataCase.descriptionCase = this.form.value.descriptionCase;
    this.dataCase.dateInitCase = this.form.value.dateInitCase;
    this.dataCase.dateEndCase = this.form.value.dateEndCase === "Sin definir" ? undefined : time;
    this.dataCase.statusCase = this.form.value.statusCase;
    this.dataCase.userRegisterCase = "1";
    this.dataCase.dateRegisterCase = time;
    this.dataCase.updateUserCase = "1";
    this.dataCase.updateDateCase = time;
    this.dataCase.typeCase = this.form.value.typeCase;
    this.dataCase.customer.idClient = this.form.value.idClient;
    console.log(this.form.value);

    this.casesService.saveCases(this.dataCase)
      .subscribe(
        rs => {
          this.idCase = rs.data[0];

          const lawyersData = this.form.value.lawyers;

          const saveLawyersRequest = lawyersData.map((element: any) => {
            delete this.dataLawyer.idCaseLawyer;
            this.dataLawyer.idLawyer = element.idLawyer;
            this.dataLawyer.idCase = `${this.idCase}`;
            this.dataLawyer.dateRegisterLawyer = time;
            this.dataLawyer.userRegisterLawyer = "1";
            console.log(element)
            return this.casesService.addCaseLawyer(this.dataLawyer).toPromise();
          });

          Promise.all(saveLawyersRequest)
          .then(
            rs => this.router.navigateByUrl("list-cases")
          )
          .catch(
            err => console.log("Error al asignar abogados",err)
          )
          
        },
        err => console.log(err)
      );    
  }
}