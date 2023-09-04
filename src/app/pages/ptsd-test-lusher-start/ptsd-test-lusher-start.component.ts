import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-ptsd-test-lusher-start',
  templateUrl: './ptsd-test-lusher-start.component.html',
  styleUrls: ['./ptsd-test-lusher-start.component.sass']
})
export class PtsdTestLusherStartComponent implements OnInit {

  constructor(
    private router: Router,
    private translocoService: TranslocoService,
  ) { }

  lang = this.translocoService.getActiveLang();
  lang_default = this.translocoService.getDefaultLang();

  ngOnInit(): void {
  }

  onNext() {
    this.router.navigate([this.lang, 'ptsd-test-lusher']);
  }

}
