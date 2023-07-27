import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TranslocoService {

  constructor() { }

  private lang = '';
  private defaultLang = 'en';

  getDefaultLang() {
    return this.defaultLang;
  }

  setActiveLang(lang: string) {
    this.lang = lang;
  }

  getActiveLang() {
    return this.lang || this.defaultLang;
  }

}
