import { Component, OnInit } from '@angular/core';
import { LawyersService } from 'src/app/services/lawyers.service';
import { DataService } from 'src/app/services/shared/data.service';

@Component({
  selector: 'app-lawyer',
  templateUrl: './lawyer.component.html',
  styleUrls: ['./lawyer.component.css']
})
export class LawyerComponent implements OnInit {

  data : any = [];
  isDarkMode: boolean = localStorage.getItem("darkMode") === "true";

  constructor(private lawyerServices : LawyersService, private dataService : DataService) { }

  ngOnInit(): void {
    this.list();
    this.heightInfo();

    this.dataService.currentDarKMode.subscribe( value => { this.isDarkMode = value; });
  }

  list() {
    this.lawyerServices.getLawyers().subscribe(
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
