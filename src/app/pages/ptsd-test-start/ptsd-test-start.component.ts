import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
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
    private translocoService: TranslocoService
  ) { }

  startTestForm = new FormGroup({
    gender: new FormControl(''),
    age: new FormControl('')
  });

  lang = this.translocoService.getActiveLang();
  lang_default = this.translocoService.getDefaultLang();

  isLoading = false;

  ngOnInit(): void {
    this.ptsdTestService.clearTest();
    this.translocoService.langChanges$.subscribe(lang => {
      this.lang = lang;
    });
  }

  onSubmit() {
    // TODO: Use EventEmitter with form value
    if (!this.startTestForm.valid) {
      return console.error(this.startTestForm);
    }

    this.isLoading = true;

    this.ptsdTestService.create(this.startTestForm.value).subscribe({
      next: (response) => {
        this.isLoading = false;
        if(response.body?.id) {
          let test: any;
          test = this.startTestForm.value;
          test.id = response.body.id;
          test.child = [];
          test.fables = [];
          test.lusher = [];
          this.ptsdTestService.setTest(test);
          console.log(this.ptsdTestService.getTest());
          this.ptsdTestService.setTestId(response.body.id);
          this.router.navigate([this.lang, 'ptsd-test', 1 ]);
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error(error);
      }
    });
  }

}
