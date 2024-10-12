import { Component, OnInit, OnDestroy } from '@angular/core';
import { LawyersService } from '../services/lawyers.service';

@Component({
  selector: 'app-lawyer',
  templateUrl: './lawyer.component.html',
  styleUrls: ['./lawyer.component.css']
})
export class LawyerComponent implements OnInit, OnDestroy {

  data : any = [];
  isDarkMode: boolean = localStorage.getItem("darkMode") === "true";
  private interval_id: any;

  constructor(private lawyerServices : LawyersService) { }

  ngOnInit(): void {
    this.list();
    this.heightInfo();

    this.interval_id = setInterval(() => { this.isDarkMode = localStorage.getItem("darkMode") === "true"; }, 1);
  }

  ngOnDestroy(): void {
    if (this.interval_id) clearInterval(this.interval_id);
  }

  list() {
    this.lawyerServices.getLawyers().subscribe(
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
