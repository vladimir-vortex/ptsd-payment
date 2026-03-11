import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { switchMap, takeWhile } from 'rxjs/operators';
import { TestService } from '../../services/test.service';

type Status = 'waiting' | 'polling' | 'success' | 'timeout' | 'error';

const INITIAL_DELAY_MS  = 3000;  // пауза перед первым запросом (ждём webhook от LiqPay)
const POLL_INTERVAL_MS  = 2000;  // интервал между запросами
const POLL_MAX_ATTEMPTS = 15;    // 15 × 2с = 30 секунд максимум

@Component({
  selector: 'app-payment-return',
  template: `
    <div class="payment-return-page">

      <!-- Ожидание / поллинг -->
      <ng-container *ngIf="status === 'waiting' || status === 'polling'">
        <div class="spinner"></div>
        <h2>Проверяем оплату...</h2>
        <p *ngIf="status === 'polling'">Это займёт несколько секунд.</p>
      </ng-container>

      <!-- Успех — мелькнёт на секунду перед редиректом -->
      <ng-container *ngIf="status === 'success'">
        <h2>Оплата прошла успешно!</h2>
        <p>Переходим к тесту...</p>
      </ng-container>

      <!-- Таймаут — оплата не подтвердилась за 30 сек -->
      <ng-container *ngIf="status === 'timeout'">
        <h2>Оплата ещё не подтверждена</h2>
        <p>Иногда подтверждение занимает чуть больше времени. Попробуйте через минуту.</p>
        <button (click)="retryPolling()">Проверить снова</button>
        <button (click)="goToCheckout()">На страницу оплаты</button>
      </ng-container>

      <!-- Ошибка — нет sessionId в URL -->
      <ng-container *ngIf="status === 'error'">
        <h2>Что-то пошло не так</h2>
        <p>Не удалось определить сессию оплаты.</p>
        <button (click)="goToCheckout()">Начать заново</button>
      </ng-container>

    </div>
  `,
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
    private testService: TestService
  ) {}

  ngOnInit(): void {
    this.lang = this.route.snapshot.params['lang'] ?? 'en';
    this.sessionId = this.route.snapshot.queryParamMap.get('session');

    if (!this.sessionId) {
      this.status = 'error';
      return;
    }

    // Искусственная задержка — даём бэкенду время обработать webhook от LiqPay
    // который может прийти чуть позже чем редирект пользователя
    setTimeout(() => this.startPolling(), INITIAL_DELAY_MS);
  }

  startPolling(): void {
    this.status = 'polling';
    this.pollAttempts = 0;

    this.pollSubscription = timer(0, POLL_INTERVAL_MS)
      .pipe(
        // Останавливаем таймер когда исчерпали попытки
        takeWhile(() => this.pollAttempts < POLL_MAX_ATTEMPTS)
      )
      .subscribe(() => {
        this.pollAttempts++;

        this.testService.checkPaymentStatus(this.sessionId!).subscribe({
          next: (res) => {
            if (res.paid && res.testToken) {
              // testToken уже сохранён в localStorage внутри TestService.checkPaymentStatus
              this.status = 'success';
              this.stopPolling();

              // Небольшая пауза чтобы пользователь увидел сообщение об успехе
              setTimeout(() => {
                this.router.navigate([`/${this.lang}/ptsd-test`]);
              }, 1000);
            } else if (this.pollAttempts >= POLL_MAX_ATTEMPTS) {
              this.status = 'timeout';
              this.stopPolling();
            }
          },
          error: () => {
            // При сетевой ошибке не прерываем поллинг — просто пропускаем итерацию
          },
        });
      });
  }

  retryPolling(): void {
    this.startPolling();
  }

  goToCheckout(): void {
    this.router.navigate([`/${this.lang}/checkout`]);
  }

  stopPolling(): void {
    this.pollSubscription?.unsubscribe();
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }
}
