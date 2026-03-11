import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TestService } from '../../services/test.service';

type Step = 'email' | 'otp' | 'redirecting';

@Component({
  selector: 'app-checkout',
  template: `
    <div class="checkout-page">

      <!-- Шаг 1: Email -->
      <ng-container *ngIf="step === 'email'">
        <h1>Введите ваш email</h1>
        <p>На него придёт код подтверждения и результат теста.</p>

        <form [formGroup]="emailForm" (ngSubmit)="otpRequest()">
          <input
            type="email"
            formControlName="email"
            placeholder="your@email.com"
            autocomplete="email"
          />
          <div class="field-error"
            *ngIf="emailForm.get('email')?.touched && emailForm.get('email')?.invalid">
            Введите корректный email
          </div>
          <button type="submit" [disabled]="emailForm.invalid || loading">
            {{ loading ? 'Отправка...' : 'Получить код' }}
          </button>
        </form>

        <p class="form-error" *ngIf="error">{{ error }}</p>
      </ng-container>

      <!-- Шаг 2: OTP -->
      <ng-container *ngIf="step === 'otp'">
        <h1>Введите код</h1>
        <p>
          Код отправлен на <strong>{{ emailForm.get('email')?.value }}</strong>
        </p>

        <form [formGroup]="otpForm" (ngSubmit)="createWithOtp()">
          <input
            type="text"
            formControlName="otp"
            placeholder="123456"
            maxlength="6"
            inputmode="numeric"
            autocomplete="one-time-code"
          />
          <div class="field-error"
            *ngIf="otpForm.get('otp')?.touched && otpForm.get('otp')?.invalid">
            Введите 6-значный код
          </div>
          <button type="submit" [disabled]="otpForm.invalid || loading">
            {{ loading ? 'Проверка...' : 'Подтвердить' }}
          </button>
        </form>

        <button class="link-btn" (click)="backToEmail()">
          ← Изменить email или запросить новый код
        </button>

        <p class="form-error" *ngIf="error">{{ error }}</p>
      </ng-container>

      <!-- Шаг 3: Редирект на LiqPay -->
      <ng-container *ngIf="step === 'redirecting'">
        <h1>Переход к оплате...</h1>
        <p>Сейчас вы будете перенаправлены на страницу оплаты.</p>

        <!--
          Скрытая форма LiqPay.
          data и signature получены с бэкенда — никогда не генерировать на фронте.
          Сабмитится автоматически через setTimeout после рендера.
        -->
        <form
          id="liqpay-form"
          method="POST"
          action="https://www.liqpay.ua/api/3/checkout"
          accept-charset="utf-8"
        >
          <input type="hidden" name="data" [value]="liqpayData" />
          <input type="hidden" name="signature" [value]="liqpaySignature" />
          <button type="submit">Перейти к оплате</button>
        </form>
      </ng-container>

    </div>
  `,
})
export class CheckoutComponent implements OnDestroy {
  step: Step = 'email';
  loading = false;
  error = '';

  emailForm: FormGroup;
  otpForm: FormGroup;

  liqpayData = '';
  liqpaySignature = '';

  private requestId: string | null = null;  // ← сюда
  // sessionId живёт только в памяти — намеренно не сохраняем нигде
  private sessionId: string | null = null;
  private lang: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private testService: TestService
  ) {
    this.lang = this.route.snapshot.params['lang'] ?? 'en';

    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    });

    // Если токен уже есть и валиден — сразу на тест
    if (this.testService.hasToken()) {
      this.router.navigate([`/${this.lang}/ptsd-test`]);
    }
  }

  otpRequest(): void {
    if (this.emailForm.invalid) return;
    this.loading = true;
    this.error = '';

    const email = this.emailForm.get('email')!.value;

    this.testService.otpRequest(email).subscribe({
      next: () => {
        this.loading = false;
        this.step = 'otp';
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Не удалось отправить код. Попробуйте ещё раз.';
      },
    });
  }

  createWithOtp(): void {
    if (this.otpForm.invalid) return;
    this.loading = true;
    this.error = '';
  
    const code = this.otpForm.get('otp')!.value;
  
    this.testService.createWithOtp(code, this.requestId!).subscribe({
      next: (res) => {
        this.testService.saveToken(res.token);
        this.loading = false;
  
        if (res.hasActiveTest) {
          this.router.navigate([`/${this.lang}/ptsd-test`]);
        } else {
          this.loadLiqPayParams();
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Неверный код.';
      },
    });
  }

  loadLiqPayParams(): void {
    this.loading = true;
    this.testService.getLiqPayParams(this.testService.getToken()!).subscribe({
      next: (res) => {
        this.liqpayData = res.data;
        this.liqpaySignature = res.signature;
        this.loading = false;
        this.step = 'redirecting';
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Ошибка при подготовке оплаты.';
      },
    });
  }

  backToEmail(): void {
    this.step = 'email';
    this.otpForm.reset();
    this.error = '';
    this.sessionId = null;
  }

  ngOnDestroy(): void {
    // Гарантируем что sessionId не утечёт
    this.sessionId = null;
  }
}
