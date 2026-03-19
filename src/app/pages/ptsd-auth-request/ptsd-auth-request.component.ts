import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { PtsdTestService } from 'src/app/services/ptsd-test.service';

@Component({
  selector: 'app-ptsd-auth-request',
  templateUrl: './ptsd-auth-request.component.html',
})
export class PtsdAuthRequestComponent {
  form: FormGroup;
  loading = false;
  message = '';
  messageType: 'error' | 'success' | 'info' = 'error';

  private lang: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private ptsdTestService: PtsdTestService,
    private translocoService: TranslocoService,
  ) {
    this.lang = this.route.snapshot.params['lang'] ?? 'en';

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  private showMessage(text: string, type: 'error' | 'success' | 'info' = 'error'): void {
    this.message = text;
    this.messageType = type;
  }

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.message = '';

    const email = this.form.get('email')!.value;

    this.ptsdTestService.otpRequest(email).subscribe({
      next: (res) => {
        this.loading = false;
        this.router.navigate([`/${this.lang}/ptsd-test/auth-verify`], {
          state: { requestId: res.id, email },
        });
      },
      error: (err) => {
        this.loading = false;
        const error = err?.error?.error;

        switch (error) {
          case 'otp_timeout':
            const wait = err?.error?.wait ?? 60;
            this.showMessage(
              this.translocoService.translate('page.auth.errorOtpTimeout', { wait })
            );
            break;
          case 'otp_ip_limit':
            this.showMessage(
              this.translocoService.translate('page.auth.errorOtpIpLimit')
            );
            break;
          default:
            this.showMessage(
              this.translocoService.translate('page.auth.errorUnknown')
            );
        }
      },
    });
  }
}