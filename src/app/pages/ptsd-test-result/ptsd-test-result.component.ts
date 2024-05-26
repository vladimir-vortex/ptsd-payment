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
    translocoService.langChanges$.subscribe(lang => {
      this.lang = lang;
    })
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
            "uk": "Дитина завжди у довірливих стосунках з батьками, відчуває любов, безумовне прийняття та позитивне схвалення дій дитини. Дитина – щаслива, гармонійна, розуміє себе, впевнена у своїх силах. Дитина відчуває підтримку родини. Вона щаслива спілкуванню із рідними. В сім’ї  її люблять, нею цікавляться, ії слухають і чують. Стосунки між дорослими і дитиною- дружні, паритетні.",
            "pl": "Dziecko zawsze pozostaje w relacji zaufania z rodzicami, odczuwa miłość, bezwarunkową akceptację i pozytywną pochwałę dla działań dziecka. Dziecko jest szczęśliwe, harmonijne, rozumie siebie, jest pewne swoich umiejętności. Dziecko czuje wsparcie rodziny. Chętnie komunikuje się z bliskimi. W rodzinie jest kochana, zainteresowana nią, słuchana i słyszana. Relacje między dorosłymi i dziećmi są przyjazne i równe."
        }
    },
    {
        "id": 2,
        "description": {
            "en": "EN Дитина має занижену самооцінку. Дитина продукує конформну поведінку. У житті  намагається відповідати нормам та стандартам дорослих. Боїться помилитися.Часто не має вибору. Батьки проявляють надмірну гіперопіку до дитини, не даючи їй самостійності. Дитина  переживає через те, що буде покарана. Страх покарання, тривожність.",
            "uk": "Дитина має занижену самооцінку. Дитина продукує конформну поведінку. У житті  намагається відповідати нормам та стандартам дорослих. Боїться помилитися.Часто не має вибору. Батьки проявляють надмірну гіперопіку до дитини, не даючи їй самостійності. Дитина  переживає через те, що буде покарана. Страх покарання, тривожність.",
            "pl": "Dziecko ma niską samoocenę. Dziecko wytwarza zachowania konformistyczne. W życiu stara się spełniać standardy dorosłych. Boi się popełnić błąd. Często nie ma wyboru. Rodzice okazują dziecku nadmierną troskę, nie dając mu niezależności. Dziecko boi się kary. Strach przed karą, niepokój."
        }
    },
    {
        "id": 3,
        "description": {
            "en": "EN Дитина, яка завжди обділена увагою, іграшками. Коли ії знецінюють. Порушують її особисті кордони. Часто це - Відсутність відповідальності, впертість, егоцентризм.",
            "uk": "Дитина, яка завжди обділена увагою, іграшками. Коли ії знецінюють. Порушують її особисті кордони. Часто це - Відсутність відповідальності, впертість, егоцентризм.",
            "pl": "Dziecko, które jest zawsze pozbawione uwagi i zabawek. Kiedy są zdewaluowane. Naruszaj jej osobiste granice. Często jest to brak odpowiedzialności, upór, egocentryzm."
        }
    },
    {
        "id": 4,
        "description": {
            "en": "EN Дитина не отримує радості від стану комфорту, доглянутості, затишку та ситості…. Можливо, ці поведінкові патерни на разі порушені. Це може свідчити про депресивний стан дитини. відсутність  емоційного відреагування. Апатія, відчудження, сум.",
            "uk": "Дитина не отримує радості від стану комфорту, доглянутості, затишку та ситості…. Можливо, ці поведінкові патерни на разі порушені. Це може свідчити про депресивний стан дитини. відсутність  емоційного відреагування. Апатія, відчудження, сум.",
            "pl": "Dziecko nie czerpie radości ze stanu komfortu, dobrego dbania, wygody i sytości.... Być może te wzorce zachowań są obecnie przełamane. Może to wskazywać na stan depresyjny dziecka. brak reakcji emocjonalnej, apatię, wyobcowanie, smutek."
        }
    }
  ];

  lusher_results: PtsdResult[] = [
    {
        "id": 1,
        "description": {
            "en": "EN Сприятливий емоційний стан",
            "uk": "Сприятливий емоційний стан"
        }
    },
    {
        "id": 2,
        "description": {
            "en": "EN Задовільний емоційний стан",
            "uk": "Задовільний емоційний стан"
        }
    },
    {
        "id": 3,
        "description": {
            "en": "EN Емоційний стан дитини незадовільний – потрібна допомога психолога, педагога",
            "uk": "Емоційний стан дитини незадовільний – потрібна допомога психолога, педагога"
        }
    },
    {
        "id": 4,
        "description": {
            "en": "EN Дитина перебуває у кризовому стані, потрібна допомога спеціалістів (психолога, психотерапевта)",
            "uk": "Дитина перебуває у кризовому стані, потрібна допомога спеціалістів (психолога, психотерапевта)"
        }
    },
  ];

  fables_results: PtsdResult[] = [
    {
        "id": 1,
        "description": {
            "en": "EN Стан особистості дитини та її почуття - в межах норми. Ознак проблем не виявлено",
            "uk": "Стан особистості дитини та її почуття - в межах норми. Ознак проблем не виявлено"
        }
    },
    {
        "id": 2,
        "description": {
            "en": "EN Стан особистості дитини та її почуття в цілому - в межах норми. Окремі відповіді не є типовими для нормального стану. Для більш точної оцінки слід звернутися до психолога",
            "uk": "Стан особистості дитини та її почуття в цілому - в межах норми. Окремі відповіді не є типовими для нормального стану. Для більш точної оцінки слід звернутися до психолога"  
        }
    },
    {
        "id": 3,
        "description": {
            "en": "EN Стан особистості дитини та її почуття, виходячи із відповідей на декілька із поставлених питань, викликають занепокоєння. Рекомендовано звернутись до психолога",
            "uk": "Стан особистості дитини та її почуття, виходячи із відповідей на декілька із поставлених питань, викликають занепокоєння. Рекомендовано звернутись до психолога"
        }
    },
    {
        "id": 4,
        "description": {
            "en": "EN Стан особистості дитини та її почуття, виходячи із відповідей на більшість із поставлених питань, викликають занепокоєння. Наполегливо рекомендуємо звернутись до психолога",
            "uk": "Стан особистості дитини та її почуття, виходячи із відповідей на більшість із поставлених питань, викликають занепокоєння. Наполегливо рекомендуємо звернутись до психолога"
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

  isOk = false;

  ngOnInit(): void {
    this.bgTestSoundService.stop();
    this.testId = this.route.snapshot.paramMap.get('id') || '';
    this.ptsdTestService.result(this.testId).subscribe({
      next: (response) => {

        if(response.ok) {
          this.isOk = true;
          if(response.body.hasOwnProperty('child') && response.body?.child != null) {

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
          }
  
          if(response.body?.lusher?.hasOwnProperty('score') && response.body?.lusher?.score != null) {
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
  
          if(response.body?.fables?.hasOwnProperty('score') && response.body?.fables?.score != null) {
  
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

      this.ptsdTestService.send(this.testId, {lang: this.lang, email: email}).subscribe({
        next: (response) => {
          this.isSending = false;
          if(response.ok) {
            this.isSend = true;
            let sendResultSendSuccessMessage = this.translocoService.translate('page.results.sendResultSendSuccessMessage');
            this._snackBar.open(sendResultSendSuccessMessage, 'OK', {
              duration: 3000
            });
          } else {
            this.isSend = false;
            let sendResultSendErrorMessage = this.translocoService.translate('page.results.sendResultSendErrorMessage');
            this._snackBar.open(sendResultSendErrorMessage, 'OK', {
              duration: 3000
            });
          }
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
