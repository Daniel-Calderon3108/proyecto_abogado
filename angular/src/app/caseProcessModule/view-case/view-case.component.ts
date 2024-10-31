import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CaseProcessService } from 'src/app/services/case-process.service';
import { Case } from 'src/app/services/model';
import { DataService } from 'src/app/services/shared/data.service';

@Component({
  selector: 'app-view-case',
  templateUrl: './view-case.component.html',
  styleUrls: ['./view-case.component.css'],
})
export class ViewCaseComponent implements OnInit {
  idCase: string = '';
  dataCaseProcess: any = [];
  dataCaseLawyer: any = [];
  currentTheme: string = localStorage.getItem('theme') || ''; // Cargar el tema desde localStorage o usar "light" como predeterminado

  constructor(private activatedRoute : ActivatedRoute, private caseService : CaseProcessService,
    private dataService : DataService, private router : Router) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.idCase = params.get('id') || '';
      this.caseProcess();
      this.caseLawyer();
    });
    this.heightInfo();

    // Suscribirse al tema actual del servicio
    this.dataService.currentTheme.subscribe((value) => {
      this.currentTheme = value;
      // Aquí podrías aplicar lógica específica para cada tema si fuera necesario
    });
  }

  caseProcess() {
    this.caseService.getCaseProcessById(parseInt(this.idCase)).subscribe(
      (rs) => (this.dataCaseProcess = rs),
      (err) => console.log(err)
    );
  }

  caseLawyer() {
    this.caseService.getCaseLawyerByIdCase(parseInt(this.idCase)).subscribe(
      (rs) => (this.dataCaseLawyer = rs),
      (err) => console.log(err)
    );
  }

  heightInfo() {
    let height: number = document.documentElement.clientHeight;

    const operationsElement = document.getElementById('info');

    if (operationsElement)
      operationsElement.style.maxHeight = `${height - 140}px`;
  }

  editCase() { this.router.navigate(['edit-case', this.dataCaseProcess.idCase]); }
}
