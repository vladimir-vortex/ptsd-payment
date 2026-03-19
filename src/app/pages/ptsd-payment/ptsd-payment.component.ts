import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { Subscription } from 'rxjs';
import { LiqPayParamsResponse, PtsdTestService } from 'src/app/services/ptsd-test.service';

@Component({
  selector: 'app-ptsd-payment',
  templateUrl: './ptsd-payment.component.html',
})
export class PtsdPaymentComponent implements OnInit, OnDestroy {
  loading = false;
  error = '';
  data = {} as LiqPayParamsResponse;

  private lang: string;
  private langSub!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ptsdTestService: PtsdTestService,
    private translocoService: TranslocoService,
  ) {
    this.lang = this.route.snapshot.params['lang'] ?? 'en';

    if (!this.ptsdTestService.hasToken()) {
      this.router.navigate([`/${this.lang}/ptsd-test/auth-request`]);
    }
  }

  ngOnInit(): void {
    this.loadLiqPayParams();

    this.langSub = this.translocoService.langChanges$.subscribe(() => {
      this.loadLiqPayParams();
    });
  }

  loadLiqPayParams(): void {
    this.loading = true;
    this.ptsdTestService.getLiqPayParams(this.ptsdTestService.getToken()!).subscribe({
      next: (res) => {
        this.data = res;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Ошибка при подготовке оплаты.';
      },
    });
  }

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
  }
}