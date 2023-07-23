import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Resolve, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';

@Injectable({
  providedIn: 'root'
})


export class LangGuard implements Resolve<string> {
  constructor(private translocoService: TranslocoService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): string | Observable<string> | Promise<string> {
    const lang = route.params?.['lang'] ?? this.translocoService.getDefaultLang();
    if(lang) {
      this.translocoService.setActiveLang(lang);
    }
    console.log(lang);
    return route.params['lang'];
  }
  
}
