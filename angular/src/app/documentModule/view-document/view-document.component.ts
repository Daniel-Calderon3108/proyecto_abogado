import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthServiceService } from 'src/app/services/authService/auth-service.service';
import { DocumentService } from 'src/app/services/document-service.service';
import { DataService } from 'src/app/services/shared/data.service';
import Swal  from 'sweetalert2';

@Component({
  selector: 'app-view-document',
  templateUrl: './view-document.component.html',
  styleUrls: ['./view-document.component.css'],
  encapsulation: ViewEncapsulation.None, // Esto desactiva el encapsulamiento
})
export class ViewDocumentComponent implements OnInit {
  idDocument: string = '';
  dataDocumentProcess: any = [];
  dataCaseProcess: any = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private dataService: DataService,
    private router: Router,
    private documentoService: DocumentService,
    private authService: AuthServiceService,
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
        this.dataService.changeMessage(true, 'El documento fue eliminado correctamente');
        this.router.navigate(['/list-document']); // Redirige a la lista de documentos
      },
      (error) => {
        console.error('Error eliminando el documento:', error);
      }
    );
  }

  SwitAllen() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
        popup: 'message-style',
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title: '¿Estas seguro?',
        text: '¡No podrás revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, borrarlo!',
        cancelButtonText: 'No, cancelar!',
        reverseButtons: false,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.deleteDocument();
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire({
            title: 'Cancelado',
            text: 'Tu archivo está seguro',
            icon: 'error',
          });
        }
      });
  }
}
