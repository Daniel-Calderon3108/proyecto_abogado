import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private theme = new BehaviorSubject<string>('');
  currentTheme = this.theme.asObservable();

  constructor() {}
  private isDarkMode = new BehaviorSubject<boolean>(false);
  private isMessageSuccess = new BehaviorSubject<boolean>(false);
  private messageSuccess = new BehaviorSubject<string>("");
  
  currentDarKMode = this.isDarkMode.asObservable();
  currentIsMessageSuccess = this.isMessageSuccess.asObservable();
  currrentMessageSuccess = this.messageSuccess.asObservable();

  changeTheme(newTheme: string): void {
    this.theme.next(newTheme);
  }

  changeMessage(newIsMessageSuccess : boolean, newMessageSuccess : string) : void {
    this.isMessageSuccess.next(newIsMessageSuccess);
    this.messageSuccess.next(newMessageSuccess);
  }
}
