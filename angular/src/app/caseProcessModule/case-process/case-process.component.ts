import { Component, OnInit } from '@angular/core';
import { CaseProcessService } from 'src/app/services/case-process.service';
import { DataService } from 'src/app/services/shared/data.service';

@Component({
  selector: 'app-case-process',
  templateUrl: './case-process.component.html',
  styleUrls: ['./case-process.component.css'],
})
export class CaseProcessComponent implements OnInit {
  data: any = [];
  currentTheme: string = localStorage.getItem('theme') || ''; // Cargar el tema desde localStorage o usar "light" como predeterminado

  constructor(
    private casesService: CaseProcessService,
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
    this.casesService.getCases().subscribe(
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
