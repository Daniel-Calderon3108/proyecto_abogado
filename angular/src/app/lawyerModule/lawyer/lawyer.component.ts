import { Component, OnInit } from '@angular/core';
import { LawyersService } from 'src/app/services/lawyers.service';
import { DataService } from 'src/app/services/shared/data.service';

@Component({
  selector: 'app-lawyer',
  templateUrl: './lawyer.component.html',
  styleUrls: ['./lawyer.component.css'],
})
export class LawyerComponent implements OnInit {
  data: any = [];
  currentTheme: string = localStorage.getItem('theme') || ''; // Cargar el tema desde localStorage o usar "light" como predeterminado

  constructor(
    private lawyerServices: LawyersService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.list();
    this.heightInfo();

    // Suscribirse al tema actual del servicio
    this.dataService.currentTheme.subscribe((value) => {
      this.currentTheme = value;
    });
  }

  list() {
    this.lawyerServices.getLawyers().subscribe(
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
      operationsElement.style.maxHeight = `${height - 150}px`;
  }
}
