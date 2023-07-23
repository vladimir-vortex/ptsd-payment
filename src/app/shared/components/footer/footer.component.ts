import { Component, OnInit } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.sass']
})
export class FooterComponent implements OnInit {

  constructor(
    private translocoService: TranslocoService
  ) { }

  lang = "en";
  lang_default = "en";

  ngOnInit(): void {
    this.translocoService.langChanges$.subscribe(lang => {
      this.lang = lang;
    });
  }

}
