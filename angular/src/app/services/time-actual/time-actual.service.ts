import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimeActualService {

  constructor() { }

  getTime() {
    // Inicializar variable para manejar fecha
    let date_actual: Date = new Date();
    // Obtener valores fecha por separado
    let year: any = date_actual.getFullYear();
    let month: any = date_actual.getMonth() + 1;
    let day: any = date_actual.getDate();
    let hour: any = date_actual.getHours();
    let minute: any = date_actual.getMinutes();
    let seconds: any = date_actual.getSeconds();

    // Agregar ceros cuando es menor a 10
    if (month < 10) month = `0${month}`;
    if (day < 10) day = `0${day}`;
    if (hour < 10) hour = `0${hour}`;
    if (minute < 10) minute = `0${minute}`;
    if (seconds < 10) seconds = `0${seconds}`;

    // Construir formato fecha para poder enviar a API
    return `${year}-${month}-${day} ${hour}:${minute}:${seconds}`;
  }
}
