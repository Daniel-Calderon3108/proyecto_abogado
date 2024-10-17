import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/shared/data.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  data : any = [];
  isDarkMode : boolean = localStorage.getItem("darkMode") == "true";

  constructor(private userService : UserService, private dataService : DataService) { }

  ngOnInit(): void {
    this.list();
    this.heightInfo();

    this.dataService.currentDarKMode.subscribe( value => { this.isDarkMode = value; });
  }

  list() {
    this.userService.getUsers().subscribe(
      rs => {
        this.data = rs;
      },
      err => console.log(err)
    )
  }

  heightInfo() {
    let height: number = document.documentElement.clientHeight;

    const operationsElement = document.getElementById("info");

    if (operationsElement) operationsElement.style.maxHeight = `${height - 140}px`;
  }

}
