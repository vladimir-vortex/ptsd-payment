import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { PtsdTestService } from 'src/app/services/ptsd-test.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { ErrorStateMatcher } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { BgTestSoundService } from 'src/app/services/bg-test-sound.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

const SEND_ICON = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentcolor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M4.01 6.03l7.51 3.22-7.52-1 .01-2.22m7.5 8.72L4 17.97v-2.22l7.51-1M2.01 3L2 10l15 2-15 2 .01 7L23 12 2.01 3z"/></svg>`;

@Component({
  selector: 'app-ptsd-test-result',
  templateUrl: './ptsd-test-result.component.html',
  styleUrls: ['./ptsd-test-result.component.sass']
})
export class PtsdTestResultComponent implements OnInit {

  constructor(
    private ptsdTestService: PtsdTestService,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private clipboard: Clipboard,
    private _snackBar: MatSnackBar,
    private router: Router,
    private translocoService: TranslocoService,
    private route: ActivatedRoute,
    private bgTestSoundService: BgTestSoundService
  ) {
    iconRegistry.addSvgIconLiteral('send', sanitizer.bypassSecurityTrustHtml(SEND_ICON));
    translocoService.langChanges$.subscribe(lang => {
      this.lang = lang;
    });
  }

  lang = this.translocoService.getActiveLang();
  lang_default = this.translocoService.getDefaultLang();

  emailFormGroup = new FormGroup({
    email: new FormControl(''),
  });

  testId = '';
  isSending = false;
  isSend = false;
  isLoading = true;
  isOk = false;
  resultUrl = window.location.href;

  textResults: number[] = [];
  textLusher: number | null = null;
  textFables: number | null = null;

  emailFormControl = new FormControl({ value: '', disabled: this.isSending || this.isSend }, [
    Validators.required,
    Validators.email,
  ]);
  matcher = new MyErrorStateMatcher();

  ngOnInit(): void {
    this.bgTestSoundService.stop();
    this.testId = this.route.snapshot.paramMap.get('id') || '';

    this.ptsdTestService.result(this.testId).subscribe({
      next: (response) => {
        if (response.ok) {
          this.isOk = true;

          if (response.body.hasOwnProperty('child') && response.body?.child != null) {
            if (response.body?.child?.param_1 > 0.6) {
              this.textResults.push(1);
            } else {
              if (response.body?.child?.param_2 > 0.1) this.textResults.push(2);
              if (response.body?.child?.param_3 > 0.1) this.textResults.push(3);
              if (response.body?.child?.param_4 > 0.1) this.textResults.push(4);
            }
          }

          if (response.body?.lusher?.hasOwnProperty('score') && response.body?.lusher?.score != null) {
            const score = response.body.lusher.score;
            if (score < 3) this.textLusher = 1;
            else if (score < 6) this.textLusher = 2;
            else if (score < 9) this.textLusher = 3;
            else this.textLusher = 4;
          }

          if (response.body?.fables?.hasOwnProperty('score') && response.body?.fables?.score != null) {
            const score = response.body.fables.score;
            if (score > 0.8) this.textFables = 1;
            else if (score > 0.7) this.textFables = 2;
            else if (score > 0.55) this.textFables = 3;
            else this.textFables = 4;
          }
        }

        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        console.error(error);
      }
    });
  }

  // onSendResult(): void {
  //   if (this.emailFormControl.valid) {
  //     this.isSending = true;
  //     this.emailFormControl.disable();

  //     const email = this.emailFormControl.value;

  //     this.ptsdTestService.send(this.testId, { lang: this.lang, email }).subscribe({
  //       next: (response) => {
  //         this.isSending = false;
  //         if (response.ok) {
  //           this.isSend = true;
  //           this._snackBar.open(
  //             this.translocoService.translate('page.results.sendResultSendSuccessMessage'),
  //             'OK', { duration: 3000 }
  //           );
  //         } else {
  //           this.isSend = false;
  //           this._snackBar.open(
  //             this.translocoService.translate('page.results.sendResultSendErrorMessage'),
  //             'OK', { duration: 3000 }
  //           );
  //         }
  //       },
  //       error: (error) => {
  //         this.isSending = false;
  //         this.emailFormControl.enable();
  //         this._snackBar.open(
  //           this.translocoService.translate('page.results.sendResultSendErrorMessage'),
  //           'OK'
  //         );
  //         console.error(error);
  //       }
  //     });
  //   }
  // }

  onCopyUrl(): void {
    this.clipboard.copy(this.resultUrl);
    this._snackBar.open('Link copied to clipboard', 'OK', {
      verticalPosition: 'top',
      horizontalPosition: 'center',
      duration: 1000
    });
  }
}