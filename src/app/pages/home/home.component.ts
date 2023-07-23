import { Component, OnInit } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {

  constructor(
    private translocoService: TranslocoService
  ) { }

  lang = this.translocoService.getActiveLang();
  lang_default = this.translocoService.getDefaultLang();

  ngOnInit(): void {
    this.translocoService.langChanges$.subscribe(lang => {
      this.lang = lang;
    });
  }

}
