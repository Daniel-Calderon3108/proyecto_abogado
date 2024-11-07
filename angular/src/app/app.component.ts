import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from './services/shared/data.service';
import { FormControl } from '@angular/forms';
import { CaseProcessService } from './services/case-process.service';
import { CustomersService } from './services/customers.service';
import { LawyersService } from './services/lawyers.service';
import { debounceTime, forkJoin, interval, map, Observable, startWith, switchMap } from 'rxjs';
import { AuthServiceService } from './services/authService/auth-service.service';
import { NotifyService } from './services/notify.service';
import { Notify } from './services/model';
import { UserService } from './services/user.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  date_actual: Date = new Date();
  private interval_id: any;
  private interval_id_notify : any;
  dataNotify: Notify[] = [];
  idNotify : any[] = [];

  currentRoute: string = '';
  showMenu: boolean = true;
  showThemeOptions: boolean = false; // Controla la visibilidad de las opciones de tema
  showNotify : boolean = false; // Mostrar notificaciones
  currentTheme: string = '';
  themes: { [key: string]: boolean } = {
    'dark-mode': false,
    'blue-mode': false,
    'law-mode': false,
    'green-mode': false,
    'default' : false
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
  nameUser: string = this.auth.getUser();
  private idUser : string = this.auth.getIdUser();
  rolUser : string = this.auth.getRolUser();

  isMessageSuccess : boolean = false;
  messageSuccess : string = "";

  countNotify : number = 0; // Contar los notificaciones no vistas por el usuario

  idRedirect : string = ""; // Id Para redigirigir al perfil de usuario
  idSearch : number = 0;

  // Imagen Perfil Usuario
  imageUrl : SafeUrl | null = null;
  imageName : string = this.auth.getPhotoUser();


  constructor(private router: Router, private dataService: DataService,
    private caseService: CaseProcessService, private customerService: CustomersService,
    private lawyerService: LawyersService, private auth : AuthServiceService, 
    private notifyService : NotifyService, private userService : UserService,
    private sanitizer : DomSanitizer) { }

  ngOnInit(): void {

    this.loadImage();

    if(this.auth.getIdUser() !== "Id Usuario Indefinido") {
      this.notifyService.getNotifyByUser(this.idUser).subscribe(
        rs => { 
          this.dataNotify = rs;
          // Contar cuales notificaciones no han sido vistas por el usuario
          for(let notifySingle of this.dataNotify) {
            if(!notifySingle.notify) { 
              this.countNotify++; 
              this.idNotify.push(notifySingle.idNotify);
            }
          }
        },
        err => console.log(err)
      )
    }
    
    if(this.rolUser === "Administrador") this.searchUser();
    if(this.rolUser === "Usuario") this.searchCustomer();
    if(this.rolUser === "Abogado") this.searchLawyer();

    if(this.auth.getIdUser() !== "Id Usuario Indefinido") this.activateInterval();

    this.dataService.changeTheme(localStorage.getItem("theme") || "");
    // Duración de la notificaciones enviadas desde otros componentes
    this.dataService.currentIsMessageSuccess.subscribe(value => { 
      this.isMessageSuccess = value;
      setTimeout(() => {
        if (this.isMessageSuccess) {
          this.dataService.changeMessage(false, this.messageSuccess);
        }
      }, 4000)
    })

    this.dataService.currrentMessageSuccess.subscribe(value => { this.messageSuccess = value; })

    // Obtener la URL completa de la ruta actual
    this.router.events.subscribe(() => {
      this.showResults = false;
      this.searchControl.setValue('');
      this.currentRoute = this.router.url;
      this.showThemeOptions = false;
      this.showNotify = false;

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
          this.showCustomer = this.dataCustomer?.length > 0 && this.rolUser === "Administrador";
          this.showCase = this.dataCase?.length > 0;
          this.showLawyer = this.dataLawyer?.length > 0 && this.rolUser === "Administrador";
          this.showResults = this.showCustomer || this.showCase || this.showLawyer;
        },
        (error) => {
          console.log('Error al encontrar resultados', error);
          this.showResults = false;
        }
      );
  }

  ngOnDestroy(): void {
    if (this.interval_id) clearInterval(this.interval_id);
    if (this.interval_id_notify) this.deactivateInterval();
  }

  // Activar Intervalo Notificaciones
  activateInterval() {
    if(this.auth.getIdUser() !== "Id Usuario Indefinido") {
      this.interval_id_notify = interval(5000) // Cada 5 segundos se obtienen todos las notificaciones
      .pipe(switchMap(() => this.notifyService.getNotifyByUser(this.idUser)))
      .subscribe((rs) => {
        this.dataNotify= rs;
        this.countNotify = 0;
        this.idNotify.length = 0;
        // Contar cuales notificaciones no han sido vistas por el usuario
        for(let notifySingle of this.dataNotify) {
          if(!notifySingle.notify) {
            this.countNotify++;
            this.idNotify.push(notifySingle.idNotify); 
          }
        }
        if(this.showNotify) this.checkNotify();
      });
    }
  }

  // Desactivar Intervalo Notificaciones
  deactivateInterval() {
    if (this.interval_id_notify) {
      this.interval_id_notify.unsubscribe();
      this.interval_id_notify = null;
    }
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

  // Abrir/Cerrar Notificaciones
  toggleNotifyOptions(): void {
    if(this.showThemeOptions && !this.showNotify) this.showThemeOptions = false;
    this.showNotify = !this.showNotify;
    this.checkNotify();
  }

  // Marcar Notificaciones como vistas
  checkNotify() {
    let notify_id = this.idNotify;

    for(let notifySingle of notify_id) {
      let notifyView : Notify  = { notify : true }
      this.notifyService.checkNotify(notifySingle, notifyView).subscribe(
        rs => this.countNotify = 0,
        err => console.log(err)
      );
    }

  }

  // Alternar visibilidad de las opciones de tema
  toggleThemeOptions(): void {
    if(this.showNotify && !this.showThemeOptions) this.showNotify = false;
    this.showThemeOptions = !this.showThemeOptions;
  }

  // Cambiar el tema basado en el diccionario de booleanos
  changeTheme(theme: string): void {
    if (this.themes.hasOwnProperty(theme)) {
      if (theme === "default") {
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
        .getCaseByIdOrName(name, this.rolUser, this.idSearch)
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
      localStorage.removeItem('idUser');
      localStorage.removeItem('nameUser');
      localStorage.removeItem('rolUser');
      this.router.navigate(['/login']);
    }
  }

  searchUser() {
    this.userService.getUserById(this.idUser).subscribe(
      rs => this.idRedirect = `user/${rs.nameUser}`,
      err => console.log(err)
    )
  }

  searchCustomer() {
    this.customerService.getByUser(parseInt(this.idUser)).subscribe(
      rs => {
        if(rs.success) { 
          this.idRedirect = `customer/${rs.singleData}`;
          this.idSearch = parseInt(rs.singleData); 
        }
        if(rs.message === "No se encontro el cliente") this.searchUser();
      },
      err => console.log(err)
    )
  }

  searchLawyer() {
    this.lawyerService.getByUser(parseInt(this.idUser)).subscribe(
      rs => {
        if (rs.success) { 
          this.idRedirect = `lawyer/${rs.singleData}`;
          this.idSearch = parseInt(rs.singleData); 
        }
        if (rs.message === "No se encontro el abogado") this.searchUser();
      },
      err => console.log(err)
    )
  }

  loadImage() {
    if(this.imageName !== 'Ninguna') {
      const url = `${origin.replace('4200', '8080')}/api/user/searchPhoto/${this.imageName}`;
      this.imageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    } else {
      this.imageUrl = 'assets/no-user.webp';
    }
  }
}