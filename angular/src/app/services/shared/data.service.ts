import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private theme = new BehaviorSubject<string>('');
  currentTheme = this.theme.asObservable();

  constructor() {}

  changeTheme(newTheme: string): void {
    this.theme.next(newTheme);
  }
}
