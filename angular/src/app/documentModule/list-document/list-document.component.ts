import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/shared/data.service';
import {  DocumentService } from 'src/app/services/document-service.service';

@Component({
  selector: 'app-list-document',
  templateUrl: './list-document.component.html',
  styleUrls: ['./list-document.component.css']
})
export class ListDocumentComponent implements OnInit {

  data: any = [];
  isDarkMode: boolean = localStorage.getItem("darkMode") === "true";

  constructor(private  documentService : DocumentService, private dataService : DataService) { }

  ngOnInit(): void {
    this.list();
    this.heightInfo();

    this.dataService.currentDarKMode.subscribe( value => { this.isDarkMode = value; });
  }

  list() {
    this.documentService.getDocument().subscribe(
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
