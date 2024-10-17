import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CaseProcessService } from 'src/app/services/case-process.service';
import { DataService } from 'src/app/services/shared/data.service';

@Component({
  selector: 'app-view-case',
  templateUrl: './view-case.component.html',
  styleUrls: ['./view-case.component.css']
})
export class ViewCaseComponent implements OnInit {

  idCase : string = "";
  dataCaseProcess: any = [];
  dataCaseLawyer : any = [];
  isDarkMode: boolean = localStorage.getItem("darkMode") === "true";

  constructor(private activatedRoute : ActivatedRoute, private caseService : CaseProcessService,
    private dataService : DataService) { }

  ngOnInit(): void {
    this.idCase = this.activatedRoute.snapshot.paramMap.get("id") || "";
    this.caseProcess();
    this.caseLawyer();
    this.heightInfo();

    this.dataService.currentDarKMode.subscribe( value => { this.isDarkMode = value; });
  }

  caseProcess() {
    this.caseService.getCaseProcessById(parseInt(this.idCase))
    .subscribe(
      rs => this.dataCaseProcess = rs,
      err => console.log(err)
    )
  }

  caseLawyer() {
    this.caseService.getCaseLawyerByIdCase(parseInt(this.idCase))
    .subscribe(
      rs => this.dataCaseLawyer = rs,
      err => console.log(err)
    )
  }

  heightInfo() {
    let height: number = document.documentElement.clientHeight;

    const operationsElement = document.getElementById("info");

    if (operationsElement) operationsElement.style.maxHeight = `${height - 140}px`;
  }
}
