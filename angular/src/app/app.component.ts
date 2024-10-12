import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from './services/shared/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  date_actual: Date = new Date();
  private interval_id: any;

  currentRoute: string = '';
  showMenu: boolean = true;
  isDarkMode : boolean = false;

  constructor(private router: Router, private dataService : DataService) { }

  ngOnInit(): void {
    // Obtener la URL completa de la ruta actual
    this.router.events.subscribe(() => {

      this.currentRoute = this.router.url;
      
      this.showMenu = this.router.url !== '/login'; // Cuando se debe mostrar el nav y el menú
      
      if (this.currentRoute === "/") {
        // Función para desplegar y cerrar menú de navegación
        const addClick = (): void => {
          const listElements: NodeListOf<Element> = document.querySelectorAll('.menu-item--show');
          
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

        addClick();
        this.heightOperation();
      }
    });

    this.interval_id = setInterval(() => { this.date_actual = new Date(); }, 1000);

    const savedTheme = localStorage.getItem("darkMode");
    this.isDarkMode = savedTheme === "true";

    this.toggleDarkMode(true);
  }

  ngOnDestroy(): void {
    if (this.interval_id) clearInterval(this.interval_id);
  }
  
  // Colapsar menú de navegación (Cerrar y Abrir)
  collapseMenu() : void {
    let nav = document.querySelector("nav") as HTMLElement;
    let icon = document.querySelector("nav i") as HTMLElement;
    let section = document.querySelector(".operations") as HTMLElement;

    section.classList.toggle("collapse");

    if (nav.classList.contains("open")) {
      nav.classList.remove("open");
      nav.classList.add("close");

      icon.classList.remove("fa-chevron-left");
      icon.classList.add("fa-chevron-right");
    } else if (nav.classList.contains("close")) {
      nav.classList.remove("close");
      nav.classList.add("open");

      icon.classList.remove("fa-chevron-right");
      icon.classList.add("fa-chevron-left");
    }
  }

  // Obtener altura
  heightOperation() : void {
    let height : number = document.documentElement.clientHeight;

    const operationsElement = document.getElementById("operations");

    if (operationsElement) operationsElement.style.height = `${height - 60}px`; 
  }

  // Guardar preferencia
  toggleDarkMode(first : boolean): void {
    if(!first) this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('darkMode', this.isDarkMode.toString()); // Guardar la preferencia en localStorage
    this.dataService.changeDarkMode(this.isDarkMode);
    this.applyTheme();
  }

  // Aplicar modo oscuro o claro
  applyTheme() : void {

    if (this.isDarkMode) {
      document.documentElement.setAttribute("theme","dark-mode");
    } else {
      document.documentElement.removeAttribute("theme");
    }
  }
}
