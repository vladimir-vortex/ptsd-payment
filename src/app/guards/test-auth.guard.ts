import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { PtsdTestService } from 'src/app/services/ptsd-test.service';

@Injectable({ providedIn: 'root' })
export class TestAuthGuard implements CanActivate {
  constructor(private ptsdTestService: PtsdTestService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const lang = route.params['lang'] ?? 'en';

    if (!this.ptsdTestService.hasToken()) {
      this.router.navigate([`/${lang}/ptsd-test/auth-request`]);
      return of(false);
    }

    return this.ptsdTestService.getTestStatus().pipe(
      map((res) => {
        switch (res.status) {
          case 'paid':
            return true;

          case 'pending':
            this.router.navigate([`/${lang}/ptsd-test/payment`]);
            return false;

          case 'completed':
            this.ptsdTestService.clearToken();
            this.router.navigate([`/${lang}/ptsd-test/auth-request`]);
            return false;

          case 'failed':
          case 'reversed':
          case 'created':
            this.router.navigate([`/${lang}/ptsd-test/payment`]);
            return false;

          case 'not_found':
          case 'expired':
          default:
            this.ptsdTestService.clearToken();
            this.router.navigate([`/${lang}/ptsd-test/auth-request`]);
            return false;
        }
      }),
      catchError(() => {
        this.router.navigate([`/${lang}/ptsd-test/auth-request`]);
        return of(false);
      })
    );
  }
}