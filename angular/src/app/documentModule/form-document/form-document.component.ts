import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentService } from 'src/app/services/document-service.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-form-document',
  templateUrl: './form-document.component.html',
  styleUrls: ['./form-document.component.css']
})
export class FormDocumentComponent implements OnInit {
  documentForm!: FormGroup;
  pdfPreviewUrl: SafeResourceUrl | null = null;

  constructor(
    private fb: FormBuilder,
    private documentService: DocumentService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.documentForm = this.fb.group({
      nameDocument: ['', Validators.required],
      typeDocument: ['', Validators.required],
      urlDocument: ['', [Validators.required]],
      dateDocument: ['', Validators.required],
      statusDocument: ['Abierto', Validators.required],
      userRegisterDocument: ['tu_usuario'],
      userUpdateDocument: ['tu_usuario'],
      dateUpdateDocument: [this.currentDate()],
      nameIdCase: this.fb.group({
        idCase: [null, Validators.required]
      })
    });
    this.heightInfo();
  }

  heightInfo() {
    let height: number = document.documentElement.clientHeight;
    const operationsElement = document.getElementById("info");
    if (operationsElement) operationsElement.style.maxHeight = `${height - 140}px`;
  }

  currentDate(): string {
    const now = new Date();
    return now.toISOString().slice(0, 10); // Formato YYYY-MM-DD
  }

  updatePreview() {
    const urlDocument = this.documentForm.get('urlDocument')?.value;
    if (urlDocument && urlDocument.endsWith('.pdf')) {
      // Sanitizar la URL para mostrar en el iframe
      this.pdfPreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(urlDocument);
    } else {
      // Si la URL está vacía o no es válida, remover la vista previa
      this.pdfPreviewUrl = null;
    }
  }

  viewFullDocument() {
    const urlDocument = this.documentForm.get('urlDocument')?.value;
    if (urlDocument) {
      window.open(urlDocument, '_blank');
    }
  }

  submitForm() {
    if (this.documentForm.valid) {
      this.documentService.saveDocument(this.documentForm.value).subscribe(response => {
        console.log('Documento guardado exitosamente', response);
        this.router.navigate(['/list-document']);
      }, error => {
        console.error('Error al guardar el documento', error);
      });
    }
  }
}