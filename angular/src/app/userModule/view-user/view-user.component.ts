import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.css']
})
export class ViewUserComponent implements OnInit {

  nameUser : string = "";
  data : any = [];


  constructor(private activatedRoute : ActivatedRoute, private userService : UserService) { }
  ngOnInit(): void {
    this.nameUser = this.activatedRoute.snapshot.paramMap.get("name") || "";
    this.user();
    this.heightInfo();
  }

  user() {
    this.userService.getUserByName(this.nameUser)
    .subscribe(
      rs => this.data = rs,
      err => console.log(err)
    )
  }

  heightInfo() {
    let height: number = document.documentElement.clientHeight;

    const operationsElement = document.getElementById("info");

    if (operationsElement) operationsElement.style.maxHeight = `${height - 140}px`;
  }

}
