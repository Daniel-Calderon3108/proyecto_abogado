import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private theme = new BehaviorSubject<string>('');
  currentTheme = this.theme.asObservable();

  constructor(private router: Router) {}
  private isDarkMode = new BehaviorSubject<boolean>(false);
  private isMessageSuccess = new BehaviorSubject<boolean>(false);
  private messageSuccess = new BehaviorSubject<string>('');

  currentDarKMode = this.isDarkMode.asObservable();
  currentIsMessageSuccess = this.isMessageSuccess.asObservable();
  currrentMessageSuccess = this.messageSuccess.asObservable();

  changeTheme(newTheme: string): void {
    this.theme.next(newTheme);
  }

  changeMessage(newIsMessageSuccess: boolean, newMessageSuccess: string): void {
    this.isMessageSuccess.next(newIsMessageSuccess);
    this.messageSuccess.next(newMessageSuccess);
  }

  // Cerrar sesión
  closeSesion() {
    if (localStorage.getItem('nameUser') && localStorage.getItem('jwtToken')) {
      localStorage.removeItem('idUser');
      localStorage.removeItem('nameUser');
      localStorage.removeItem('rolUser');
      localStorage.removeItem('photoUser');
      localStorage.removeItem('jwtToken');
      this.router.navigate(['/login']);
    }
  }
}
