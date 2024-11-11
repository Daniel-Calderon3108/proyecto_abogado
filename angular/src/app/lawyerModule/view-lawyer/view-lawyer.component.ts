import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { LawyersService } from 'src/app/services/lawyers.service';
import { DataService } from 'src/app/services/shared/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TimeActualService } from 'src/app/services/time-actual/time-actual.service';
import { Lawyers } from 'src/app/services/model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-view-lawyer',
  templateUrl: './view-lawyer.component.html',
  styleUrls: ['./view-lawyer.component.css'],
})
export class ViewLawyerComponent implements OnInit {
  idLawyer: string = '';
  data: any = [];
  currentTheme: string = localStorage.getItem('theme') || ''; // Cargar el tema desde localStorage o usar "light" como predeterminado
  isCase: boolean = false;
  statusActual: boolean = true;
  @ViewChild('status') status!: ElementRef;
  @ViewChild('lastUpdate') lastUpdate!: ElementRef;

  imageUrl : SafeUrl | null = null;

  constructor(
    private lawyerService: LawyersService,
    private dataService: DataService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private time: TimeActualService,
    private renderer: Renderer2,
    private sanitizer : DomSanitizer,
    private http : HttpClient
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.idLawyer = params.get('id') || '';
      this.lawyer();
    });
    this.heightInfo();

    // Suscribirse al tema actual del servicio
    this.dataService.currentTheme.subscribe((value) => {
      this.currentTheme = value;
    });
  }

  lawyer() {
    this.lawyerService.getLawyerByID(parseInt(this.idLawyer)).subscribe(
      (rs) => {
        this.data = rs;
        this.isCase = this.data.caseLawyer?.length <= 0;
        if (rs.photoUser != 'Ninguna') {
          const url = `${origin.replace('4200', '8080')}/api/user/searchPhoto/${rs.photoUser}`;
          this.http.get(url, { responseType: 'blob' }).subscribe(
            rs => { 
              const imageUrl = URL.createObjectURL(rs);
              this.imageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(imageUrl);
            },
            err => console.log(err)
          );
        } else {
          this.imageUrl = 'assets/no-user.webp';
        }
      },
      (err) => console.log(err)
    );
  }

  heightInfo() {
    let height: number = document.documentElement.clientHeight;

    const operationsElement = document.getElementById('info');

    if (operationsElement)
      operationsElement.style.maxHeight = `${height - 150}px`;
  }

  editLawyer() {
    this.router.navigate(['edit-lawyer', this.data.idLawyer]);
  }

  changeStatus() {
    let lawyer: Lawyers = {
      userUpdateLawyer: 'Administrador',
      dateUpdateLawyer: this.time.getTime(),
      user: {
        userUpdate: 'Administrador',
        lastUpdate: this.time.getTime(),
      },
    };

    this.lawyerService.changeStatus(this.data.idLawyer, lawyer).subscribe(
      (rs) => {
        if (rs.success == true) {
          this.statusActual = !this.statusActual;
          let status = this.statusActual ? "Activo" : "Inactivo";
          this.renderer.setProperty(this.status.nativeElement, 'innerHTML', status);
          this.renderer.setProperty(this.lastUpdate.nativeElement, 'innerHTML', this.time.getTime());
          this.dataService.changeMessage(true, `Se cambio el estado a ${status.toLowerCase()} con exito.`);
        } else {
          console.log(rs.message);
        }
      },
      (err) => console.log('Hubo un error al cambiar el estado' + err)
    );
  }
}
