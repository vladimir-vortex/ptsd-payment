import { Component } from '@angular/core';
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
      error: (error) => {
        this.isLoading = false;
        console.error(error);
      },
    });
  }

  restart(): void {
    this.ptsdTestService.clearTest();
    this.router.navigate([this.lang, 'ptsd-test']);
  }
}