import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/services/model';
import { TimeActualService } from 'src/app/services/time-actual/time-actual.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.css']
})
export class ViewUserComponent implements OnInit {

  nameUser : string = "";
  data : any = [];
  statusActual : boolean = true;
  @ViewChild("status") status! : ElementRef;
  @ViewChild("lastUpdate") lastUpdate! : ElementRef;

  constructor(private activatedRoute : ActivatedRoute, private userService : UserService, 
    private router : Router, private time : TimeActualService, private renderer : Renderer2) { }
  ngOnInit(): void {
   this.activatedRoute.paramMap.subscribe(params =>{
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
        this.statusActual = rs.statusUser ? true : false
      },
      err => console.log(err)
    )
  }

  heightInfo() {
    let height: number = document.documentElement.clientHeight;

    const operationsElement = document.getElementById("info");

    if (operationsElement) operationsElement.style.maxHeight = `${height - 140}px`;
  }

  editUser() { this.router.navigate(['edit-user',this.data.id_user]); }

  changeStatus() {
    let user : User = {
      userUpdate: "Administrador",
      lastUpdate: this.time.getTime()
    }

    this.userService.changeStatus(this.data.id_user,user).subscribe(
      rs => {
        if(rs.success === true) {
          this.statusActual = !this.statusActual;
          let status = this.statusActual ? "Activo" : "Inactivo"
          this.renderer.setProperty(this.status.nativeElement, 'innerHTML', status);
          this.renderer.setProperty(this.lastUpdate.nativeElement, 'innerHTML', this.time.getTime());
        } else {
          console.log(rs.message);
        }
      },
      err => console.log("Hubo un error al cambiar el estado" + err)
    );
  }
}
