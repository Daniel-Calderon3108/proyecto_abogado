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
    private time: TimeActualService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.idDocument = params.get('id') || '';
      this.documentId();
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

  heightInfo() {
    let height: number = document.documentElement.clientHeight;

    const operationsElement = document.getElementById('info');

    if (operationsElement)
      operationsElement.style.maxHeight = `${height - 150}px`;
  }

  // view-document.component.ts
  deleteDocument() {
    const id = parseInt(this.idDocument);
    this.documentoService.deleteDocument(id).subscribe(
      (deletedDocument) => {
        console.log(
          `Documento "${deletedDocument.nameDocument}" eliminado exitosamente`
        );
        this.router.navigate(['/list-document']); // Redirige a la lista de documentos
      },
      (error) => {
        console.error('Error eliminando el documento:', error);
      }
    );
  }
}
