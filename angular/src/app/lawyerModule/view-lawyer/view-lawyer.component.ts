import { Component, OnInit } from '@angular/core';
import { LawyersService } from 'src/app/services/lawyers.service';
import { DataService } from 'src/app/services/shared/data.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-lawyer',
  templateUrl: './view-lawyer.component.html',
  styleUrls: ['./view-lawyer.component.css']
})
export class ViewLawyerComponent implements OnInit {

  idLawyer : string = "";
  data : any = [];
  isDarkMode : boolean = localStorage.getItem("darkMode") === "true";
  isCase : boolean = false;

  constructor(private lawyerService : LawyersService, private dataService : DataService,
    private activatedRoute : ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params =>{
      this.idLawyer = params.get("id") || "";
      this.lawyer();
    })
    this.heightInfo();

    this.dataService.currentDarKMode.subscribe( value => { this.isDarkMode = value; });
  }

  lawyer() {
    this.lawyerService.getLawyerByID(parseInt(this.idLawyer))
    .subscribe(
      rs => { 
        this.data = rs;
        this.isCase = this.data.caseLawyer?.length <= 0;
      },
      err => console.log(err)
    );
  }

  heightInfo() {
    let height: number = document.documentElement.clientHeight;

    const operationsElement = document.getElementById("info");

    if (operationsElement) operationsElement.style.maxHeight = `${height - 140}px`;
  }

}
