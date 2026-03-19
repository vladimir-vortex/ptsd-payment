import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { PtsdTestService } from 'src/app/services/ptsd-test.service';

@Component({
  selector: 'app-ptsd-user-bar',
  templateUrl: './ptsd-user-bar.component.html',
})
export class PtsdUserBarComponent implements OnInit {

  constructor(
    private ptsdTestService: PtsdTestService,
    private router: Router,
    private translocoService: TranslocoService,
  ) {}

  userEmail = '';
  lang = this.translocoService.getActiveLang();

  ngOnInit(): void {
    this.ptsdTestService.getTestInfo().subscribe({
      next: (res) => this.userEmail = res.email,
      error: () => this.userEmail = '',
    });
  }

  logout(): void {
    this.ptsdTestService.clearToken();
    this.ptsdTestService.clearTest();
    this.router.navigate([`/${this.lang}/ptsd-test/auth-request`]);
  }
}