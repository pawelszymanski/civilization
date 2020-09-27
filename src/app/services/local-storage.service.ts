import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class LocalStorageService {

  localStorage: Storage;

  constructor() {
    this.initLocalStorage();
  }

  private initLocalStorage(): void {
    this.localStorage = window.localStorage;
  }

  public get(key: string): any {
    return JSON.parse(this.localStorage.getItem(key));
  }

  public set(key: string, value: any): void {
    this.localStorage.setItem(key, JSON.stringify(value));
  }

  public remove(key: string): void {
    this.localStorage.removeItem(key);
  }

}
