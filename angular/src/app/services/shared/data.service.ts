import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private isDarkMode = new BehaviorSubject<boolean>(false); 
  
  currentDarKMode = this.isDarkMode.asObservable();

  constructor() { }

  changeDarkMode(newValue : boolean) : void {
    this.isDarkMode.next(newValue);
  }
}
