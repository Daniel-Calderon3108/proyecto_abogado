import { Component, OnInit } from '@angular/core';
import { Case, CaseLawyer } from '../services/model';
import { CaseProcessService } from '../services/case-process.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-form-case-process',
  templateUrl: './form-case-process.component.html',
  styleUrls: ['./form-case-process.component.css']
})
export class FormCaseProcessComponent implements OnInit {

  dataCase : Case = {
    idCase: "",
    nameCase: "",
    descriptionCase: "",
    dateInitCase: "",
    dateEndCase: "",
    statusCase: "Abierto",
    userRegisterCase: "",
    dateRegisterCase: "",
    updateUserCase: "",
    updateDateCase: "",
    typeCase: "",
    customer: {
      idClient: ""
    }
  } 

  dataLawyer : CaseLawyer = {
    idCaseLawyer: "",
    dateRegisterLawyer: "",
    userRegisterLawyer: "",
    statusLawyerCase: true,
    idLawyer: "",
    idCase: ""
  }


  constructor(private casesService : CaseProcessService, private router : Router, private activatedRoute : ActivatedRoute) { }

  ngOnInit(): void {
    const param = this.activatedRoute.snapshot;
    this.heightInfo();
  }

  heightInfo() {
    let height: number = document.documentElement.clientHeight;

    const operationsElement = document.getElementById("info");

    if (operationsElement) operationsElement.style.maxHeight = `${height - 140}px`;
  }
}
