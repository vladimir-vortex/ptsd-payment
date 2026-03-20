import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const TOKEN_KEY = 'testToken';
const API = environment.apiUrl;

export interface Answer {
  questionId: number;
  answer: number;
}

export interface OtpRequestResponse {
  id: string;
}

export interface CreateWithOtpResponse {
  token: string;
  hasActiveTest: boolean;
}

export interface LiqPayParamsResponse {
  data: string;
  signature: string;
  amount: number;
  description: string;
  currency: string;
  order_id: string;
}

export interface TestStatusResponse {
  status: 'created' | 'pending' | 'paid' | 'completed' | 'failed' | 'reversed' | 'expired' | 'not_found';
}

@Injectable({ providedIn: 'root' })
export class PtsdTestService {
  constructor(
    private http: HttpClient,
    private translocoService: TranslocoService
    ) {}

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  });

  answers: Answer[] = [];

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

  getLiqPayParams(token: string): Observable<LiqPayParamsResponse> {
    return this.http.post<LiqPayParamsResponse>(`${API}/api/v1/ptsd-test/create-order`, {
      token,
      lang: this.translocoService.getActiveLang(),
    });
  }
  // ─── Test status ─────────────────────────────────────────────────────────────

  getTestStatus(): Observable<TestStatusResponse> {
    return this.http.post<TestStatusResponse>(`${API}/api/v1/ptsd-test/status`, {
      token: this.getToken(),
    });
  }


  getTestInfo(): Observable<{ email: string }> {
    return this.http.post<{ email: string }>(`${API}/api/v1/ptsd-test/info`, {
      token: this.getToken(),
    });
  }

  // ─── Test data ───────────────────────────────────────────────────────────────

  updateTestData(body: any): Observable<any> {
    return this.http.post<any>(
      `${API}/api/v1/ptsd-test/update`,
      { token: this.getToken(), ...body },
      { headers: this.headers, observe: 'response', responseType: 'json' }
    );
  }

  submit(answers: any): Observable<any> {
    return this.http.post<any>(
      `${API}/api/v1/ptsd-test/answers`,
      { 
        token: this.getToken(),
        answers,
        lang: this.translocoService.getActiveLang()
      },
      { headers: this.headers, observe: 'response', responseType: 'json' }
    );
  }

  result(testId: string): Observable<any> {
    return this.http.get<any>(
      `${API}/api/v1/ptsd-test/${testId}/results`,
      { headers: this.headers, observe: 'response', responseType: 'json' }
    );
  }

  send(id: string, body: any): Observable<any> {
    return this.http.post<any>(
      `${API}/api/v1/ptsd-test/${id}/send-results`,
      body,
      { headers: this.headers, observe: 'response', responseType: 'json' }
    );
  }

  // ─── Questions ───────────────────────────────────────────────────────────────

  getQuestions(): Observable<any> {
    return this.http.get<any>('assets/data/ptsd-questions.json');
  }

  getFablesQuestions(): Observable<any> {
    return this.http.get<any>('assets/data/ptsd-fables-questions.json');
  }

  getResults(): Observable<any> {
    return this.http.get<any>('assets/data/ptsd-results.json');
  }

  // ─── localStorage — token ─────────────────────────────────────────────────────

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

  // ─── localStorage — test data ─────────────────────────────────────────────────

  setTest(test: any): void {
    localStorage.setItem('ptsd-test-data', JSON.stringify(test));
  }

  getTest(): any {
    return JSON.parse(localStorage.getItem('ptsd-test-data') || '{}');
  }

  clearTest(): void {
    localStorage.removeItem('ptsd-test-data');
  }

  // ─── Answers ──────────────────────────────────────────────────────────────────

  setAnswer(answer: Answer): void {
    const idx = this.answers.findIndex((e) => answer.questionId === e.questionId);
    if (idx !== -1) {
      this.answers.splice(idx, 1);
    }
    this.answers.push(answer);
  }
}