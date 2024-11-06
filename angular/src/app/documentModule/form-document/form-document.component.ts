import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentService } from 'src/app/services/document-service.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  startWith,
  switchMap,
} from 'rxjs';
import { CaseProcessService } from 'src/app/services/case-process.service';
import { TimeActualService } from 'src/app/services/time-actual/time-actual.service';
import { AuthServiceService } from 'src/app/services/authService/auth-service.service';
import { DataService } from 'src/app/services/shared/data.service';

@Component({
  selector: 'app-form-document',
  templateUrl: './form-document.component.html',
  styleUrls: ['./form-document.component.css'],
})
export class FormDocumentComponent implements OnInit {
  // Propiedades para el archivo y la vista previa
  selectedFile: File | null = null;
  filePreviewUrl: SafeResourceUrl | null = null;

  form = new FormGroup({
    nameDocument: new FormControl(''),
    urlDocument: new FormControl(''),
    statusDocument: new FormControl('Abierto'),
    typeDocument: new FormControl('Penal'),
    userRegisterDocument: new FormControl(''),
    userUpdateDocument: new FormControl(''),
    dateUpdateDocument: new FormControl(''),
    dateDocument: new FormControl(''),
    idCase: new FormControl('', [Validators.required]),
    nameCaseSelect: new FormControl(''),
  });

  idCaseParam: string = ''; // Id Caso si es actualizar
  edit: boolean = false; // ¿Actualizar?

  inputType: string = 'text';
  inputValue: string = 'Sin definir';
  readonly: Boolean = true;
  idCase: number = 0;
  showSearchCase: boolean = false;
  dataCase: any[] = [];
  nameCaseControl = new FormControl('');

  isNameValidation: boolean = false;
  isValidName: boolean = false;
  nameMessage: string = '';

  messageSubmit: string = '';

  constructor(
    private casesService: CaseProcessService,
    private documentService: DocumentService,
    private router: Router,
    private time: TimeActualService,
    private auth: AuthServiceService,
    private dataService: DataService,
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.heightInfo();

    this.activatedRoute.paramMap.subscribe((params) => {
      if (params.has('id')) {
        this.idCaseParam = params.get('id') || '';
        this.searchEditDocument(this.idCaseParam);
      } else {
      }
    });

    const selectElement = document.getElementById(
      'statusDocument'
    ) as HTMLSelectElement | null;

    if (selectElement) {
      selectElement.addEventListener('change', (event: Event) => {
        const target = event.target as HTMLSelectElement;
        const selectedValue = target.value;

        if (selectedValue === 'Abierto' || selectedValue === 'Re Abierto') {
          this.inputType = 'text';
          this.inputValue = 'Sin definir';
          this.readonly = true;
        } else {
          this.inputType = 'date';
          this.inputValue = '';
          this.readonly = false;
        }
      });
    }

    // Nombre del caso con control de búsqueda

    this.nameCaseControl.valueChanges
      .pipe(
        debounceTime(300), // Esperar 300ms después de que el usuario deja de escribir
        distinctUntilChanged(),
        startWith(''),
        switchMap((name) => this.searchCase(name))
      )
      .subscribe(
        (data) => {
          this.dataCase = data;
          this.showSearchCase = this.dataCase.length > 0; // Mostrar resultados si hay datos
        },
        (error) => {
          console.error('Error al buscar caso:', error);
          this.showSearchCase = false;
        }
      );

    // Nombre del caso con control de búsqueda final

    this.form
      .get('nameDocument')
      ?.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        map((name) => {
          this.isNameValidation = true;
          this.isValidName = false;
          this.nameMessage = '';

          const rules = [
            {
              test: (name: string) => !!name,
              message: 'El campo nombre no puede estar vacío.',
            },
            {
              test: (name: string) => name.length >= 8,
              message: 'El nombre debe tener al menos 8 caracteres.',
            },
            {
              test: (name: string) => !/[^a-zA-Z0-9\s]+$/.test(name),
              message: 'El nombre no puede contener caracteres especiales.',
            },
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

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        const fileResult = reader.result as string;
        if (this.selectedFile?.type === 'application/pdf') {
          this.filePreviewUrl =
            this.sanitizer.bypassSecurityTrustResourceUrl(fileResult);
        } else if (this.selectedFile?.type.startsWith('image/')) {
          this.filePreviewUrl =
            this.sanitizer.bypassSecurityTrustUrl(fileResult);
        }
      };

      reader.readAsDataURL(this.selectedFile);
    } else {
      // Restablecer si no hay archivo seleccionado
      this.resetPreview();
    }
  }

  resetPreview(): void {
    this.selectedFile = null;
    this.filePreviewUrl = null;
  }

  heightInfo() {
    let height: number = document.documentElement.clientHeight;

    const operationsElement = document.getElementById('info');

    if (operationsElement)
      operationsElement.style.maxHeight = `${height - 140}px`;
  }
  searchEditDocument(id: string) {
    if (id) {
      this.documentService.getDocumentById(parseInt(id)).subscribe(
        (rs) => {
          this.form.get('nameDocument')?.setValue(rs.nameDocument);
          this.form.get('urlDocument')?.setValue(rs.urlDocument);
          this.form.get('dateDocument')?.setValue(rs.dateDocument);
          if (
            rs.statusDocument == 'Abierto' ||
            rs.statusDocument == 'Re Abierto'
          ) {
            this.inputType = 'text';
            this.inputValue = 'Sin definir';
            this.readonly = true;
          } else {
            this.inputType = 'date';
            this.inputValue = rs.dateDocument || '';
            this.readonly = false;
          }
          this.form.get('statusDocument')?.setValue(rs.statusDocument);
          this.form.get('typeDocument')?.setValue(rs.typeDocument);
          this.form
            .get('nameCaseSelect')
            ?.setValue(
              `${rs.nameIdCase?.typeCase} - ${rs.nameIdCase?.nameCase}`
            );
          this.form.get('idCase')?.setValue(rs.nameIdCase?.idCase);
          this.edit = true;
        },
        (err) =>
          console.log(
            'Hubo un error al traer la información del documento' + err
          )
      );
    }
  }

  // Buscar el caso

  searchCase(name: string): Observable<any[]> {
    if (name.length < 3) {
      this.showSearchCase = false; // No mostrar resultados si menos de 3 caracteres
      return new Observable((observer) => observer.next([])); // Retornar un observable vacío
    }
    return this.casesService.getCaseByIdOrName(name).pipe(
      map((Cases) => Cases.slice(0, 5)) // Limitar a los primeros 5 resultados
    ); // Retornar el observable del servicio
  }

  // Buscar el caso final

  // Seleccionar el caso

  selectCase(caseId: string, typeCase: string, nameCase: string) {
    this.form.get('idCase')?.setValue(caseId); // Establecer el ID del cliente seleccionado
    this.form.get('nameCaseSelect')?.setValue(`${typeCase} - ${nameCase}`);
    this.showSearchCase = false; // Ocultar la lista de sugerencias
    this.nameCaseControl.setValue(''); // Limpiar el campo de búsqueda
  }

  // Seleccionar el caso final

  isLoading: boolean = false;

  save() {
    if (!(this.isValidName && this.form.valid)) {
      this.messageSubmit =
        'Por favor, revisar que todos los campos estén debidamente diligenciados.';
      return;
    }

    this.isLoading = true; // Activa el estado de carga

    // Crear el FormData y agregar los campos
    const formData = new FormData();
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }
    formData.append('nameDocument', this.form.value.nameDocument || '');
    formData.append('urlDocument', this.form.value.urlDocument || '');
    formData.append('typeDocument', this.form.value.typeDocument || '');
    formData.append('statusDocument', this.form.value.statusDocument || '');
    formData.append(
      'userRegisterDocument',
      !this.edit ? this.auth.getUser() : ''
    );
    formData.append('dateDocument', this.time.getTime());
    formData.append('userUpdateDocument', this.auth.getUser());
    formData.append('dateUpdateDocument', this.time.getTime());
    formData.append('idCase', this.form.value.idCase || '');

    // Enviar datos y manejar el estado de carga
    this.documentService
      .saveDocument(formData, this.edit, this.idCaseParam)
      .subscribe(
        (response) => {
          console.log('Documento guardado con éxito:', response);
          this.isLoading = false; // Desactiva el estado de carga en éxito
        },
        (error) => {
          console.error('Error al guardar el documento:', error);
          this.messageSubmit =
            'Error al guardar el documento. Intente de nuevo.';
          this.isLoading = false; // Desactiva el estado de carga en error
        }
      );
  }
}
