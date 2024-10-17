import { Component, OnInit } from '@angular/core';
import { CaseProcessService } from 'src/app/services/case-process.service';
import { DataService } from 'src/app/services/shared/data.service';

@Component({
  selector: 'app-case-process',
  templateUrl: './case-process.component.html',
  styleUrls: ['./case-process.component.css']
})
export class CaseProcessComponent implements OnInit {

  data: any = [];
  isDarkMode: boolean = localStorage.getItem("darkMode") === "true";

  constructor(private casesService : CaseProcessService, private dataService : DataService) { }

  ngOnInit(): void {
    this.list();
    this.heightInfo();

    this.dataService.currentDarKMode.subscribe( value => { this.isDarkMode = value; });
  }

  list() {
    this.casesService.getCases().subscribe(
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
