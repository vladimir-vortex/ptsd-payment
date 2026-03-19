import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';

const LANG_KEY = 'preferredLang';
const AVAILABLE_LANGS = ['en', 'pl', 'uk'];

@Injectable({ providedIn: 'root' })
export class LangGuard implements Resolve<string> {
  constructor(private translocoService: TranslocoService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): string | Observable<string> | Promise<string> {
    const langFromUrl = route.params?.['lang'];

    // Если язык в URL валидный — сохраняем его как предпочтительный
    if (langFromUrl && AVAILABLE_LANGS.includes(langFromUrl)) {
      localStorage.setItem(LANG_KEY, langFromUrl);
      this.translocoService.setActiveLang(langFromUrl);
      return langFromUrl;
    }

    // Иначе берём сохранённый или дефолтный
    const savedLang = localStorage.getItem(LANG_KEY);
    const lang = savedLang && AVAILABLE_LANGS.includes(savedLang)
      ? savedLang
      : this.translocoService.getDefaultLang();

    this.translocoService.setActiveLang(lang);
    return lang;
  }
}