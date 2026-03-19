import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { PtsdTestService } from 'src/app/services/ptsd-test.service';

@Component({
  selector: 'app-ptsd-auth-verify',
  templateUrl: './ptsd-auth-verify.component.html',
})
export class PtsdAuthVerifyComponent implements OnInit, OnDestroy {
  @ViewChild('ngOtpInput') ngOtpInput: any;

  loading = false;
  error = '';

  email: string;
  requestId: string;
  private lang: string;

  resending = false;
  private timer: any;

  countdown = 60;
  canResend = false;

  otpValue = '';

  submitBlocked = false;

  otpConfig = {
    length: 4,
    allowNumbersOnly: true,
    containerClass: 'otp-container',
    inputStyles: {
      width: '56px',
      height: '64px',
      fontSize: '1.5rem',
      fontWeight: '600',
      borderRadius: '8px',
      border: '1px solid #ccc',
      margin: '0 6px',
    },
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ptsdTestService: PtsdTestService,
    private translocoService: TranslocoService,
    private _snackBar: MatSnackBar,
  ) {
    this.lang = this.route.snapshot.params['lang'] ?? 'en';

    const state = this.router.getCurrentNavigation()?.extras?.state
      ?? history.state;

    this.email = state?.['email'] ?? '';
    this.requestId = state?.['requestId'] ?? '';

    if (!this.requestId) {
      this.router.navigate([`/${this.lang}/ptsd-test/auth-request`]);
    }
  }

  ngOnInit(): void {
    this.startCountdown();
  }

  startCountdown(): void {
    this.countdown = 60;
    this.canResend = false;
    clearInterval(this.timer);

    this.timer = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(this.timer);
        this.canResend = true;
      }
    }, 1000);
  }

  private blockOtp(): void {
    setTimeout(() => {
      const inputs = document.querySelectorAll('.otp-container input');
      inputs.forEach(input => input.setAttribute('disabled', 'true'));
    });
  }

  private clearOtp(): void {
    this.otpValue = '';
    this.ngOtpInput?.setValue('');
  }

  private unblockOtp(): void {
    setTimeout(() => {
      const inputs = document.querySelectorAll('.otp-container input');
      inputs.forEach(input => input.removeAttribute('disabled'));
      this.clearOtp();
      const first = document.querySelector('.otp-container input') as HTMLInputElement;
      first?.focus();
    });
  }

  onOtpChange(value: string): void {
    this.otpValue = value;
  }

  resend(): void {
    if (this.resending) return;
    this.resending = true;

    this.ptsdTestService.otpRequest(this.email).subscribe({
      next: (res) => {
        this.requestId = res.id;
        this.resending = false;
        this.error = '';
        this.submitBlocked = false;
        this.unblockOtp();
        this.startCountdown();
      },
      error: (err) => {
        this.resending = false;
        const errorKey = err?.error?.message;
        const message = this.translocoService.translate(`page.auth.${errorKey}`) !== `page.auth.${errorKey}`
          ? this.translocoService.translate(`page.auth.${errorKey}`)
          : this.translocoService.translate('common.error.unknown');

        this._snackBar.open(message, 'OK', {
          verticalPosition: 'top',
          horizontalPosition: 'center',
          duration: 3000
        });
      },
    });
  }

  submit(): void {
    if (this.otpValue.length !== 4 || !this.requestId) return;
    this.loading = true;
    this.error = '';

    this.blockOtp();

    this.ptsdTestService.createWithOtp(this.otpValue, this.requestId).subscribe({
      next: (res) => {
        this.loading = false;
        this.ptsdTestService.saveToken(res.token);

        if (res.hasActiveTest) {
          this.router.navigate([`/${this.lang}/ptsd-test`]);
        } else {
          this.router.navigate([`/${this.lang}/ptsd-test/payment`]);
        }
      },
      error: (err) => {
        this.loading = false;
        const errorKey = err?.error?.message;
      
        if (['errorOtpVerifyNotFound', 'errorOtpVerifyExpired', 'errorOtpVerifyInvalid'].includes(errorKey)) {
          this.submitBlocked = true;
          this.canResend = true;
          clearInterval(this.timer);
        }
      
        const message = this.translocoService.translate(`page.auth.${errorKey}`) !== `page.auth.${errorKey}`
          ? this.translocoService.translate(`page.auth.${errorKey}`)
          : this.translocoService.translate('common.error.unknown');
      
        this._snackBar.open(message, 'OK', {
          verticalPosition: 'top',
          horizontalPosition: 'center',
          duration: 3000
        });
      },
    });
  }

  back(): void {
    this.router.navigate([`/${this.lang}/ptsd-test/auth-request`]);
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }
}