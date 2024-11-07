import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthServiceService } from 'src/app/services/authService/auth-service.service';
import { CaseProcessService } from 'src/app/services/case-process.service';
import { DocumentService } from 'src/app/services/document-service.service';
import { DataService } from 'src/app/services/shared/data.service';
import { TimeActualService } from 'src/app/services/time-actual/time-actual.service';

@Component({
  selector: 'app-view-document',
  templateUrl: './view-document.component.html',
  styleUrls: ['./view-document.component.css'],
})
export class ViewDocumentComponent implements OnInit {
  idDocument: string = '';
  dataDocumentProcess: any = [];
  dataCaseProcess: any = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private caseService: CaseProcessService,
    private router: Router,
    private documentoService: DocumentService,
    private time: TimeActualService,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.idDocument = params.get('id') || '';
      this.documentId();
      this.caseProcess();
    });
    this.heightInfo();
  }


  // Obtener información documento
  documentId() {
    this.documentoService.getDocumentById(parseInt(this.idDocument)).subscribe(
      (rs) => (this.dataDocumentProcess = rs),
      (err) => console.log(err)
    );
  }
  // Obtener los casos asignados al documento
  caseProcess() {
    this.caseService.getCaseProcessById(parseInt(this.idDocument)).subscribe(
      (rs) => (this.dataCaseProcess = rs),
      (err) => console.log(err)
    );
  }

  heightInfo() {
    let height: number = document.documentElement.clientHeight;

    const operationsElement = document.getElementById('info');

    if (operationsElement)
      operationsElement.style.maxHeight = `${height - 140}px`;
  }
}
