import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthServiceService } from 'src/app/services/authService/auth-service.service';
import { User } from 'src/app/services/model';
import { DataService } from 'src/app/services/shared/data.service';
import { TimeActualService } from 'src/app/services/time-actual/time-actual.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.css']
})
export class ViewUserComponent implements OnInit {

  nameUser: string = "";
  data: any = [];
  statusActual: boolean = true;
  @ViewChild("status") status!: ElementRef;
  @ViewChild("lastUpdate") lastUpdate!: ElementRef;
  imageUrl: SafeUrl | null = null;

  constructor(private activatedRoute: ActivatedRoute, private userService: UserService,
    private router: Router, private time: TimeActualService, private renderer: Renderer2,
    private dataService: DataService, private auth: AuthServiceService, 
    private sanitizer : DomSanitizer, private http : HttpClient) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.nameUser = params.get("name") || "";
      this.user();
    })

    this.heightInfo();
  }

  user() {
    this.userService.getUserByName(this.nameUser)
      .subscribe(
        rs => {
          this.data = rs
          this.statusActual = rs.statusUser ? true : false;
          if(rs.photoUser !== 'Ninguna') {
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
        err => console.log(err)
      )
  }

  heightInfo() {
    let height: number = document.documentElement.clientHeight;

    const operationsElement = document.getElementById("info");

    if (operationsElement) operationsElement.style.maxHeight = `${height - 150}px`;
  }

  editUser() { this.router.navigate(['edit-user', this.data.idUser]); }

  changeStatus() {
    let user: User = {
      userUpdate: this.auth.getUser(),
      lastUpdate: this.time.getTime()
    }

    this.userService.changeStatus(this.data.idUser, user).subscribe(
      rs => {
        if (rs.success === true) {
          this.statusActual = !this.statusActual;
          let status = this.statusActual ? "Activo" : "Inactivo"
          this.renderer.setProperty(this.status.nativeElement, 'innerHTML', status);
          this.renderer.setProperty(this.lastUpdate.nativeElement, 'innerHTML', this.time.getTime());
          this.dataService.changeMessage(true, `Se cambio el estado a ${status.toLowerCase()} con exito.`);
        } else {
          console.log(rs.message);
        }
      },
      err => console.log("Hubo un error al cambiar el estado" + err)
    );
  }
}
