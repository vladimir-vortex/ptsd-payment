import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { switchMap, takeWhile } from 'rxjs/operators';
import { PtsdTestService } from 'src/app/services/ptsd-test.service';

type Status = 'waiting' | 'polling' | 'success' | 'timeout' | 'error';

const INITIAL_DELAY_MS = 3000;  // пауза перед первым запросом (ждём webhook от LiqPay)
const POLL_INTERVAL_MS = 2000;  // интервал между запросами
const POLL_MAX_ATTEMPTS = 15;    // 15 × 2с = 30 секунд максимум

@Component({
  selector: 'app-payment-return',
  templateUrl: './payment-return.component.html',
})
export class PaymentReturnComponent implements OnInit, OnDestroy {
  status: Status = 'waiting';

  private sessionId: string | null = null;
  private lang: string = 'en';
  private pollSubscription?: Subscription;
  private pollAttempts = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ptsdTestService: PtsdTestService
  ) { }

  ngOnInit(): void {
    this.lang = this.route.snapshot.params['lang'] ?? 'en';
  
    if (!this.ptsdTestService.hasToken()) {
      this.status = 'error';
      return;
    }
  
    setTimeout(() => this.startPolling(), INITIAL_DELAY_MS);
  }

  startPolling(): void {
    this.status = 'polling';
    this.pollAttempts = 0;

    this.pollSubscription = timer(0, POLL_INTERVAL_MS)
      .pipe(
        takeWhile(() => this.pollAttempts < POLL_MAX_ATTEMPTS)
      )
      .subscribe(() => {
        this.pollAttempts++;

        this.ptsdTestService.getTestStatus().subscribe({
          next: (res) => {
            if (res.status === 'paid') {
              this.status = 'success';
              this.stopPolling();
              setTimeout(() => {
                this.router.navigate([`/${this.lang}/ptsd-test`]);
              }, 1000);
            } else if (res.status === 'failed' || res.status === 'reversed') {
              this.status = 'error';
              this.stopPolling();
            } else if (this.pollAttempts >= POLL_MAX_ATTEMPTS) {
              this.status = 'timeout';
              this.stopPolling();
            }
          },
          error: () => {
            // пропускаем итерацию при сетевой ошибке
          },
        });
      });
  }

  retryPolling(): void {
    this.startPolling();
  }

  goToCheckout(): void {
    this.router.navigate([`/${this.lang}/ptsd-test/payment`]);
  }

  stopPolling(): void {
    this.pollSubscription?.unsubscribe();
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }
}
