import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { PtsdTestService } from 'src/app/services/ptsd-test.service';

@Component({
  selector: 'app-ptsd-test-complete',
  templateUrl: './ptsd-test-complete.component.html',
  styleUrls: ['./ptsd-test-complete.component.sass'],
})
export class PtsdTestCompleteComponent {
  private lang: string;
  isLoading = false;

  constructor(
    private ptsdTestService: PtsdTestService,
    private router: Router,
    private route: ActivatedRoute,
    private translocoService: TranslocoService,
    private _snackBar: MatSnackBar,
  ) {
    this.lang = this.route.snapshot.params['lang'] ?? 'en';
  }

  submit(): void {
    this.isLoading = true;
    const test = this.ptsdTestService.getTest();

    this.ptsdTestService.submit(test).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.body?.testId) {
          this.router.navigate([this.lang, 'ptsd-test-result', response.body.testId]);
        }
      },
      // error: (error) => {
      //   this.isLoading = false;
      //   console.error(error);
      // },

      error: (err) => {
        this.isLoading = false;
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

  restart(): void {
    this.ptsdTestService.clearTest();
    this.router.navigate([this.lang, 'ptsd-test']);
  }
}