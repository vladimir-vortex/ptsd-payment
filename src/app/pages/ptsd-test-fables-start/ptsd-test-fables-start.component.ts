import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { BgTestSoundService } from 'src/app/services/bg-test-sound.service';

@Component({
  selector: 'app-ptsd-test-fables-start',
  templateUrl: './ptsd-test-fables-start.component.html',
  styleUrls: ['./ptsd-test-fables-start.component.sass']
})

export class PtsdTestFablesStartComponent implements OnInit {

  constructor(
    private router: Router,
    private translocoService: TranslocoService,
    private bgTestSoundService: BgTestSoundService
  ) { }

  lang = this.translocoService.getActiveLang();
  lang_default = this.translocoService.getDefaultLang();
  isBgSoundPlaying = false;

  ngOnInit(): void {
    this.isBgSoundPlaying = this.bgTestSoundService.isPlaying;
  }

  onNext() {
    this.router.navigate([this.lang, 'ptsd-test-fables', 1]);
  }

  onBgSoundClick() {
    if(this.isBgSoundPlaying == false) {
      this.bgTestSoundService.start();
      this.isBgSoundPlaying = this.bgTestSoundService.isPlaying;
    } else {
      this.bgTestSoundService.pause();
      this.isBgSoundPlaying = this.bgTestSoundService.isPlaying;
    }
  }

}