import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-ptsd-test-fables-start',
  templateUrl: './ptsd-test-fables-start.component.html',
  styleUrls: ['./ptsd-test-fables-start.component.sass']
})

export class PtsdTestFablesStartComponent implements OnInit {

  constructor(
    private router: Router,
    private translocoService: TranslocoService,
  ) { }

  lang = this.translocoService.getActiveLang();
  lang_default = this.translocoService.getDefaultLang();

  ngOnInit(): void {
  }

  onNext() {
    this.router.navigate([this.lang, 'ptsd-test-fables', 1]);
  }

}
