import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { TestService } from '../services/test.service';

@Injectable({ providedIn: 'root' })
export class TestAuthGuard implements CanActivate {
  constructor(private testService: TestService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    // Язык берём из URL — он всегда есть в params т.к. все роуты вида :lang/...
    const lang = route.params['lang'] ?? 'en';

    // Быстрая проверка — токен вообще есть в localStorage?
    if (!this.testService.hasToken()) {
      this.router.navigate([`/${lang}/checkout`]);
      return of(false);
    }

    // Полная проверка — токен валиден на бэкенде?
    return this.testService.validateToken().pipe(
      map((res) => {
        if (res.valid) {
          return true;
        }
        this.testService.clearToken();
        this.router.navigate([`/${lang}/checkout`]);
        return false;
      }),
      catchError(() => {
        // Сетевая ошибка — не наказываем пользователя,
        // но и внутрь не пускаем пока не убедимся в валидности токена
        this.testService.clearToken();
        this.router.navigate([`/${lang}/checkout`]);
        return of(false);
      })
    );
  }
}
