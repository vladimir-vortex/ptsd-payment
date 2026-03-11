import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const TOKEN_KEY = 'testToken';
const API = environment.apiUrl; // ← замените на ваш базовый URL

export interface OtpRequestResponse {
  id: string;
}

export interface CreateWithOtpResponse {
  token: string;
  hasActiveTest: boolean; // true = есть незавершённый оплаченный тест
}

export interface LiqPayParamsResponse {
  data: string;       // base64 JSON с параметрами заказа, сформированный бэкендом
  signature: string;  // SHA1 подпись бэкенда
}

export interface PaymentStatusResponse {
  paid: boolean;
  testToken?: string;
}

export interface ValidateTokenResponse {
  valid: boolean;
}

export interface TestFinishResponse {
  resultHash: string;
}

@Injectable({ providedIn: 'root' })
export class TestService {
  constructor(private http: HttpClient) { }

  // ─── OTP ─────────────────────────────────────────────────────────────────────

  otpRequest(email: string): Observable<OtpRequestResponse> {
    return this.http.post<OtpRequestResponse>(`${API}/api/v1/ptsd-test/otp-request`, { email });
  }

  createWithOtp(code: string, requestId: string): Observable<CreateWithOtpResponse> {
    return this.http.post<CreateWithOtpResponse>(`${API}/api/v1/ptsd-test/create-with-otp`, { 
      code,
      requestId,
    });
  }
  

  // ─── LiqPay ──────────────────────────────────────────────────────────────────

  /**
   * Получить с бэкенда подписанные параметры LiqPay для формы оплаты.
   * Бэкенд формирует data (base64 JSON) и signature (SHA1).
   * НЕ генерировать подпись на фронте — там нет приватного ключа.
   *
   * Бэкенд должен включить в параметры LiqPay:
   *   result_url: https://yoursite.com/:lang/payment-return?session={sessionId}
   *   server_url: https://yoursite.com/api/payment/liqpay-callback
   */
  getLiqPayParams(token: string): Observable<LiqPayParamsResponse> {
    return this.http.post<LiqPayParamsResponse>(`${API}/api/v1/ptsd-test/payment/create-order`, {
      token,
    });
  }

  // ─── Payment status (поллинг) ─────────────────────────────────────────────────

  /**
   * Проверить статус оплаты по sessionId.
   * Если paid=true — автоматически сохраняет testToken в localStorage.
   */
  checkPaymentStatus(sessionId: string): Observable<PaymentStatusResponse> {
    return this.http
      .get<PaymentStatusResponse>(`${API}/api/v1/ptsd-test/payment/status`, {
        params: { session: sessionId },
      })
      .pipe(
        tap((res) => {
          if (res.paid && res.testToken) {
            this.saveToken(res.testToken);
          }
        })
      );
  }

  // ─── Test ─────────────────────────────────────────────────────────────────────

  /** Проверить валидность токена на бэкенде. Вызывается guard'ом при каждом входе. */
  validateToken(): Observable<ValidateTokenResponse> {
    return this.http.post<ValidateTokenResponse>(`${API}/api/v1/ptsd-test/auth/validate`, {
      token: this.getToken(),
    });
  }

  /**
   * Завершить тест и отправить результаты.
   * Вызывается из PtsdTestLusherComponent.
   * Бэкенд: инвалидирует токен + генерирует resultHash + шлёт email с ссылкой.
   * Фронт: получает resultHash → чистит localStorage → редиректит на результат.
   */
  finishTest(answers: unknown): Observable<TestFinishResponse> {
    return this.http.post<TestFinishResponse>(`${API}/test/finish`, {
      token: this.getToken(),
      answers,
    });
  }

  // ─── localStorage helpers ─────────────────────────────────────────────────────

  saveToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  hasToken(): boolean {
    return !!this.getToken();
  }
}
