import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { BgTestSoundService } from 'src/app/services/bg-test-sound.service';
import { PtsdTestService } from 'src/app/services/ptsd-test.service';

@Component({
  selector: 'app-ptsd-test-start',
  templateUrl: './ptsd-test-start.component.html',
  styleUrls: ['./ptsd-test-start.component.sass']
})
export class PtsdTestStartComponent implements OnInit {

  constructor(
    private ptsdTestService: PtsdTestService,
    private router: Router,
    private translocoService: TranslocoService,
    private bgTestSoundService: BgTestSoundService
  ) { }

  startTestForm = new FormGroup({
    gender: new FormControl(''),
    age: new FormControl('')
  });

  lang = this.translocoService.getActiveLang();
  lang_default = this.translocoService.getDefaultLang();

  isLoading = false;
  isIntro = true;

  isBgSoundPlaying = false;

  ngOnInit(): void {
    this.ptsdTestService.clearTest();
    this.translocoService.langChanges$.subscribe(lang => {
      this.lang = lang;
    });
  }

  onStart() {
    this.isIntro = false;
    this.bgTestSoundService.stop();
    this.bgTestSoundService.start();
    this.isBgSoundPlaying = this.bgTestSoundService.isPlaying;
  }

  onSubmit() {
    if (!this.startTestForm.valid) {
      return console.error(this.startTestForm);
    }

    let test: any = this.startTestForm.value;
    test.child = [];
    test.fables = [];
    test.lusher = [];
    this.ptsdTestService.setTest(test);

    this.router.navigate([this.lang, 'ptsd-test', 'question', 1]);
  
    // this.isLoading = true;


  
    // this.ptsdTestService.updateTestData(this.startTestForm.value).subscribe({
    //   next: (response) => {
    //     this.isLoading = false;
    //     if (response.ok) {
    //       let test: any = this.startTestForm.value;
    //       test.child = [];
    //       test.fables = [];
    //       test.lusher = [];
    //       this.ptsdTestService.setTest(test);
    //       this.router.navigate([this.lang, 'ptsd-test', 'question', 1]);
    //     }
    //   },
    //   error: (error) => {
    //     this.isLoading = false;
    //     console.error(error);
    //   }
    // });
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
