import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class LocalStorageService {

  readonly MAX_USED_SPACE = 1024 * 1024;

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

  private getUsage(): number {
    let totalMb = 0;
    for (const x in localStorage) {
      const amount = (localStorage[x].length);
      if (!isNaN(amount) && localStorage.hasOwnProperty(x)) {
        totalMb += amount;
      }
    }
    return totalMb;
  };

  public getUsagePc(): number {
    return (this.getUsage() / this.MAX_USED_SPACE) * 100;
  }

}
