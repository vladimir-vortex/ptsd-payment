import { Component, OnInit } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { BgTestSoundService } from 'src/app/services/bg-test-sound.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {

  constructor(
    private translocoService: TranslocoService,
    private bgTestSoundService: BgTestSoundService
  ) { }

  lang = this.translocoService.getActiveLang();
  lang_default = this.translocoService.getDefaultLang();

  ngOnInit(): void {
    this.translocoService.langChanges$.subscribe(lang => {
      this.lang = lang;
    });
    this.bgTestSoundService.stop();
  }

}
