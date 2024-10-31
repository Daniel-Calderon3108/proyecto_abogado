import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from './services/shared/data.service';
import { FormControl } from '@angular/forms';
import { CaseProcessService } from './services/case-process.service';
import { CustomersService } from './services/customers.service';
import { LawyersService } from './services/lawyers.service';
import { debounceTime, forkJoin, map, Observable, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  date_actual: Date = new Date();
  private interval_id: any;

  currentRoute: string = '';
  showMenu: boolean = true;
  showThemeOptions: boolean = false; // Controla la visibilidad de las opciones de tema
  currentTheme: string = '';
  themes: { [key: string]: boolean } = {
    'dark-mode': false,
    'blue-mode': false,
    'law-mode': false,
    'green-mode': false,
    // Agrega más temas aquí si es necesario
  };
  searchControl = new FormControl('');
  showResults: boolean = false;
  showCase: boolean = false;
  showLawyer: boolean = false;
  showCustomer: boolean = false;
  dataCase: any = [];
  dataLawyer: any = [];
  dataCustomer: any = [];
  nameUser: string = localStorage.getItem('nameUser') || 'Usuario';

  constructor(
    private router: Router,
    private dataService: DataService,
    private caseService: CaseProcessService,
    private customerService: CustomersService,
    private lawyerService: LawyersService
  ) {}

  ngOnInit(): void {
    // Obtener la URL completa de la ruta actual
    this.router.events.subscribe(() => {
      this.showResults = false;
      this.searchControl.setValue('');
      this.currentRoute = this.router.url;

      this.showMenu = this.router.url !== '/login'; // Cuando se debe mostrar el nav y el menú

      if (this.showMenu) {
        this.addClick();
        this.heightOperation();
      }
    });

    this.interval_id = setInterval(() => {
      this.date_actual = new Date();
    }, 1000);

    const savedTheme = localStorage.getItem('theme') || '';
    if (savedTheme && this.themes.hasOwnProperty(savedTheme)) {
      this.themes[savedTheme] = true;
      this.currentTheme = savedTheme;
    } else {
      this.themes['default'] = true;
      this.currentTheme = 'default';
    }
    this.applyTheme();

    // Suscribirse al cambio de tema desde el servicio
    this.dataService.currentTheme.subscribe((theme) => {
      this.activateTheme(theme);
    });

    this.searchControl.valueChanges
      .pipe(
        debounceTime(300), // Esperar 300ms después de que el usuario deja de escribir
        startWith(''),
        switchMap((name) => this.search(name))
      )
      .subscribe(
        ([cases, customers, lawyers]) => {
          this.dataCustomer = customers;
          this.dataCase = cases;
          this.dataLawyer = lawyers;
          this.showResults =
            this.dataCustomer?.length > 0 ||
            this.dataCase?.length > 0 ||
            this.dataLawyer?.length > 0;
          this.showCustomer = this.dataCustomer?.length > 0;
          this.showCase = this.dataCase?.length > 0;
          this.showLawyer = this.dataLawyer?.length > 0;
        },
        (error) => {
          console.log('Error al encontrar resultados', error);
          this.showResults = false;
        }
      );
  }

  ngOnDestroy(): void {
    if (this.interval_id) clearInterval(this.interval_id);
  }

  // Función para desplegar y cerrar menú de navegación
  addClick() {
    const listElements: NodeListOf<Element> =
      document.querySelectorAll('.menu-item--show');
    if (listElements.length == 0) {
      window.location.reload();
    }
    listElements.forEach((element: Element) => {
      element.addEventListener('click', () => {
        // Aseguramos que el elemento tenga hijos y que el segundo hijo sea un elemento HTML
        const submenu = element.children[1] as HTMLElement;
        let height: number = 0;

        element.classList.toggle('menu-item--active');

        if (submenu.clientHeight === 0) height = submenu.scrollHeight;

        submenu.style.height = `${height}px`;
      });
    });
  }

  // Colapsar menú de navegación (Cerrar y Abrir)
  collapseMenu(): void {
    let nav = document.querySelector('nav') as HTMLElement;
    let icon = document.querySelector('nav i') as HTMLElement;
    let section = document.querySelector('.operations') as HTMLElement;

    section.classList.toggle('collapse');

    const isOpen = nav.classList.toggle('open');
    nav.classList.toggle('close', !isOpen);
    icon.classList.toggle('fa-chevron-left', isOpen);
    icon.classList.toggle('fa-chevron-right', !isOpen);
  }

  // Obtener altura
  heightOperation(): void {
    let height: number = document.documentElement.clientHeight;

    const operationsElement = document.getElementById('operations');

    if (operationsElement) operationsElement.style.height = `${height - 60}px`;
  }

  // Alternar visibilidad de las opciones de tema
  toggleThemeOptions(): void {
    this.showThemeOptions = !this.showThemeOptions;
  }

  // Cambiar el tema basado en el diccionario de booleanos
  changeTheme(theme: string): void {
    if (this.themes.hasOwnProperty(theme)) {
      if (this.themes[theme]) {
        // Si el tema ya está activo, lo desactivamos
        this.themes[theme] = false;
        this.currentTheme = '';
        localStorage.removeItem('theme');
        this.dataService.changeTheme('');
      } else {
        // Si el tema está inactivo, activamos este y desactivamos los demás
        this.activateTheme(theme);
        localStorage.setItem('theme', theme);
        this.dataService.changeTheme(theme);
      }
      this.applyTheme();
    }
  }

  // Activar un tema en el diccionario
  private activateTheme(theme: string): void {
    // Desactivar todos los temas
    for (let key in this.themes) {
      this.themes[key] = false;
    }
    // Activar el tema seleccionado
    this.themes[theme] = true;
    this.currentTheme = theme;
  }

  // Aplicar el tema actual
  applyTheme(): void {
    document.documentElement.setAttribute(
      'theme',
      this.currentTheme || 'default'
    );
  }

  // Buscar Por Cliente, Caso y Abogado
  search(name: string): Observable<any[]> {
    if (name.length < 3) {
      this.showResults = false;
      return new Observable((observer) => observer.next([[], [], []]));
    }

    return forkJoin([
      this.caseService
        .getCaseByIdOrName(name)
        .pipe(map((cases) => cases.slice(0, 4))),
      this.customerService
        .getCustomerByName(name)
        .pipe(map((customers) => customers.slice(0, 4))),
      this.lawyerService
        .getLawyerByName(name)
        .pipe(map((lawyers) => lawyers.slice(0, 4))),
    ]);
  }

  // Redigir al resultado seleccionado
  redirectResult(type: string, result: string) {
    this.router.navigate([type, result]).then(() => {
      this.showResults = false;
      this.searchControl.setValue('');
    });
  }

  // Cerrar Resultados de la busqueda cuando se pierde el foco
  closeSearch() {
    setTimeout(() => {
      this.showResults = false;
    }, 200);
  }

  // Cerrar sesión
  closeSesion() {
    if (localStorage.getItem('nameUser')) {
      localStorage.removeItem('nameUser');
      localStorage.removeItem('rolUser');
      this.router.navigate(['/login']);
    }
  }
}
