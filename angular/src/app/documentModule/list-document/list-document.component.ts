import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/shared/data.service';
import {  DocumentService } from 'src/app/services/document-service.service';

@Component({
  selector: 'app-list-document',
  templateUrl: './list-document.component.html',
  styleUrls: ['./list-document.component.css'],
})
export class ListDocumentComponent implements OnInit {
  data: any = [];
  currentTheme: string = localStorage.getItem('theme') || ''; // Cargar el tema desde localStorage o usar "light" como predeterminado

  constructor(
    private documentService: DocumentService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.list();
    this.heightInfo();

    // Suscribirse al tema actual del servicio
    this.dataService.currentTheme.subscribe((value) => {
      this.currentTheme = value;
      // Aquí podrías aplicar lógica específica para cada tema si fuera necesario
    });
  }

  list() {
    this.documentService.getDocument().subscribe(
      (rs) => {
        this.data = rs;
      },
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
