import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { PtsdTestService } from 'src/app/services/ptsd-test.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { ErrorStateMatcher } from '@angular/material/core';
import { timer } from 'rxjs';
import { PtsdResult } from 'src/app/interfaces/ptsd-result';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { BgTestSoundService } from 'src/app/services/bg-test-sound.service';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

const SEND_ICON =
  `
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentcolor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M4.01 6.03l7.51 3.22-7.52-1 .01-2.22m7.5 8.72L4 17.97v-2.22l7.51-1M2.01 3L2 10l15 2-15 2 .01 7L23 12 2.01 3z"/></svg>
`;


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
    // Note that we provide the icon here as a string literal here due to a limitation in
    // Stackblitz. If you want to provide the icon from a URL, you can use:
    // `iconRegistry.addSvgIcon('thumbs-up', sanitizer.bypassSecurityTrustResourceUrl('icon.svg'));`
    iconRegistry.addSvgIconLiteral('send', sanitizer.bypassSecurityTrustHtml(SEND_ICON));
  }

  lang = this.translocoService.getActiveLang();
  lang_default = this.translocoService.getDefaultLang();

  emailFormGroup = new FormGroup({
    email: new FormControl(''),
  });

  testId ='';

  isSending = false;
  isSend = false;
  isLoading = true;
  resultUrl = window.location.href;

  results: PtsdResult[] = [
    {
        "id": 1,
        "description": {
            "en": "EN Дитина завжди у довірливих стосунках з батьками, відчуває любов, безумовне прийняття та позитивне схвалення дій дитини. Дитина – щаслива, гармонійна, розуміє себе, впевнена у своїх силах. Дитина відчуває підтримку родини. Вона щаслива спілкуванню із рідними. В сім’ї  її люблять, нею цікавляться, ії слухають і чують. Стосунки між дорослими і дитиною- дружні, паритетні.",
            "uk": "UK Дитина завжди у довірливих стосунках з батьками, відчуває любов, безумовне прийняття та позитивне схвалення дій дитини. Дитина – щаслива, гармонійна, розуміє себе, впевнена у своїх силах. Дитина відчуває підтримку родини. Вона щаслива спілкуванню із рідними. В сім’ї  її люблять, нею цікавляться, ії слухають і чують. Стосунки між дорослими і дитиною- дружні, паритетні."
        }
    },
    {
        "id": 2,
        "description": {
            "en": "EN Дитина має занижену самооцінку. Дитина продукує конформну поведінку. У житті  намагається відповідати нормам та стандартам дорослих. Боїться помилитися.Часто не має вибору. Батьки проявляють надмірну гіперопіку до дитини, не даючи їй самостійності. Дитина  переживає через те, що буде покарана. Страх покарання, тривожність.",
            "uk": "UK Дитина має занижену самооцінку. Дитина продукує конформну поведінку. У житті  намагається відповідати нормам та стандартам дорослих. Боїться помилитися.Часто не має вибору. Батьки проявляють надмірну гіперопіку до дитини, не даючи їй самостійності. Дитина  переживає через те, що буде покарана. Страх покарання, тривожність."
        }
    },
    {
        "id": 3,
        "description": {
            "en": "EN Дитина, яка завжди обділена увагою, іграшками. Коли ії знецінюють. Порушують її особисті кордони. Часто це - Відсутність відповідальності, впертість, егоцентризм.",
            "uk": "UK Дитина, яка завжди обділена увагою, іграшками. Коли ії знецінюють. Порушують її особисті кордони. Часто це - Відсутність відповідальності, впертість, егоцентризм."
        }
    },
    {
        "id": 4,
        "description": {
            "en": "EN Дитина не отримує радості від стану комфорту, доглянутості, затишку та ситості…. Можливо, ці поведінкові патерни на разі порушені. Це може свідчити про депресивний стан дитини. відсутність  емоційного відреагування. Апатія, відчудження, сум.",
            "uk": "UK Дитина не отримує радості від стану комфорту, доглянутості, затишку та ситості…. Можливо, ці поведінкові патерни на разі порушені. Це може свідчити про депресивний стан дитини. відсутність  емоційного відреагування. Апатія, відчудження, сум."
        }
    }
  ];

  lusher_results: PtsdResult[] = [
    {
        "id": 1,
        "description": {
            "en": "EN Сприятливий емоційний стан",
            "uk": "UK Сприятливий емоційний стан"
        }
    },
    {
        "id": 2,
        "description": {
            "en": "EN Задовільний емоційний стан",
            "uk": "UK Задовільний емоційний стан"
        }
    },
    {
        "id": 3,
        "description": {
            "en": "EN Емоційний стан дитини незадовільний – потрібна допомога психолога, педагога",
            "uk": "UK Емоційний стан дитини незадовільний – потрібна допомога психолога, педагога"
        }
    },
    {
        "id": 4,
        "description": {
            "en": "EN Дитина перебуває у кризовому стані, потрібна допомога спеціалістів (психолога, психотерапевта)",
            "uk": "UK Дитина перебуває у кризовому стані, потрібна допомога спеціалістів (психолога, психотерапевта)"
        }
    },
  ];

  fables_results: PtsdResult[] = [
    {
        "id": 1,
        "description": {
            "en": "EN Стан особистості дитини та її почуття - в межаї норми. Ознак проблем не виявлено",
            "uk": "UK Стан особистості дитини та її почуття - в межаї норми. Ознак проблем не виявлено"
        }
    },
    {
        "id": 2,
        "description": {
            "en": "EN Стан особистості дитини та її почуття в цілому - в межаї норми. Окремі відповіді не є типовими для нормального стану. Для більш точної оцінки слід звернутися до психолога",
            "uk": "UK Стан особистості дитини та її почуття в цілому - в межаї норми. Окремі відповіді не є типовими для нормального стану. Для більш точної оцінки слід звернутися до психолога"
        }
    },
    {
        "id": 3,
        "description": {
            "en": "EN Стан особистості дитини та її почуття виходячи із відповідей на декілька із поставлених питаннь викликають занепокоєння. Рекомендовано звернутись до психолога",
            "uk": "UK Стан особистості дитини та її почуття виходячи із відповідей на декілька із поставлених питаннь викликають занепокоєння. Рекомендовано звернутись до психолога"
        }
    },
    {
        "id": 4,
        "description": {
            "en": "EN Стан особистості дитини та її почуття виходячи із відповідей на більшість із поставлених питаннь викликають занепокоєння. Наполегливо рекомендуємо звернутись до психолога",
            "uk": "UK Стан особистості дитини та її почуття виходячи із відповідей на більшість із поставлених питаннь викликають занепокоєння. Наполегливо рекомендуємо звернутись до психолога"
        }
    },
  ];

  test: any;

  textResults: PtsdResult[] = [];

  textLusher: any;

  textFables: any;

  scoreLusher: number = 0;

  scoreFables = 0.0;

  emailFormControl = new FormControl({ value: '', disabled: this.isSending || this.isSend }, [Validators.required, Validators.email, ]);
  matcher = new MyErrorStateMatcher();

  ngOnInit(): void {
    this.bgTestSoundService.stop();
    this.testId = this.route.snapshot.paramMap.get('id') || '';
    this.ptsdTestService.result(this.testId).subscribe({
      next: (response) => {
        if(response.body?.child?.param_1 > 0.6) {
          this.textResults.push(this.results[0]);
        } else {
          if(response.body?.child?.param_2 > 0.1) {
            this.textResults.push(this.results[1]);
          };
          if(response.body?.child?.param_3 > 0.1) {
            this.textResults.push(this.results[2]);
          };
          if(response.body?.child?.param_4 > 0.1) {
            this.textResults.push(this.results[3]);
          };
        }

        if(response.body?.lusher?.score) {
          this.scoreLusher = response.body?.lusher?.score;
          
          if(this.scoreLusher < 3) {
            this.textLusher = this.lusher_results[0];
          } else if(this.scoreLusher < 6) {
            this.textLusher = this.lusher_results[1];
          } else if(this.scoreLusher < 9) {
            this.textLusher = this.lusher_results[2];
          } else {
            this.textLusher = this.lusher_results[3];
          }
        }

        if(response.body?.fables?.score) {
          this.scoreFables = response.body?.fables?.score;
          
          if(this.scoreFables > 0.8) {
            this.textFables = this.fables_results[0];
          } else if(this.scoreFables > 0.7) {
            this.textFables = this.fables_results[1];
          } else if(this.scoreFables > 0.55) {
            this.textFables = this.fables_results[2];
          } else {
            this.textFables = this.fables_results[3];
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

  onSendResult(): void {
    if(this.emailFormControl.valid) {
      this.isSending = true;

      this.emailFormControl.disable();

      let email = this.emailFormControl.value;

      this.ptsdTestService.send({testId: this.testId, email: email}).subscribe({
        next: (response) => {
          this.isSending = false;
          this.isSend = true;
          let sendResultSendSuccessMessage = this.translocoService.translate('page.results.sendResultSendSuccessMessage');
          this._snackBar.open(sendResultSendSuccessMessage, 'OK', {
            duration: 3000
          });
          console.log(response);
          // if(response.body?.id) {
          //   this.ptsdTestService.setTestId(response.body.id);
          // }
        },
        error: (error) => {
          this.isSending = false;
          this.emailFormControl.enable();
          let sendResultSendErrorMessage = this.translocoService.translate('page.results.sendResultSendErrorMessage');
          this._snackBar.open(sendResultSendErrorMessage, 'OK', {
            // duration: 3000
          });
          console.error(error);
        }
      });
      // timer(2000)
      //   .pipe()
      //   .subscribe(
      //     res => {
      //       this.isSending = false;
      //       this._snackBar.open('Email has been send!', 'OK', {
      //         duration: 3000
      //       });
      //     }
      //   );
    }
  }

  onCopyUrl() {
    this.clipboard.copy(this.resultUrl);
    this._snackBar.open('Link copied to clipboard', 'OK', {
      duration: 1000
    });
  }


}
