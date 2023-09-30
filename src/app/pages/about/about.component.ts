import { Component, OnInit } from '@angular/core';
import { BgTestSoundService } from 'src/app/services/bg-test-sound.service';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.sass']
})
export class AboutComponent implements OnInit {

  constructor(
    private bgTestSoundService: BgTestSoundService,
    private translocoService: TranslocoService
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
