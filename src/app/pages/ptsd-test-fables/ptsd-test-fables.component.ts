import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationError, NavigationStart, Router, Event } from '@angular/router';
import { PtsdTestService } from 'src/app/services/ptsd-test.service';
import { FormControl, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { PtsdQuestion } from 'src/app/interfaces/ptsd-question';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-ptsd-test-fables',
  templateUrl: './ptsd-test-fables.component.html',
  styleUrls: ['./ptsd-test-fables.component.sass']
})
export class PtsdTestFablesComponent implements OnInit {

  constructor(
    private ptsdTestService: PtsdTestService,
    private route: ActivatedRoute,
    private router: Router,
    private translocoService: TranslocoService
  ) { }

  lang = this.translocoService.getActiveLang();
  lang_default = this.translocoService.getDefaultLang();

  imagesUrl = environment.imagesUrl;
  
  questionId = 1;

  questions!: PtsdQuestion[];
  question!: PtsdQuestion | null;

  prevQuestion: PtsdQuestion | undefined;
  nextQuestion: PtsdQuestion | undefined;

  gender = 'g';

  isLoading = true;

  answerForm = new FormGroup({
    answer: new FormControl(''),
  });

  answers: any;
  answer: any;
  test: any;
  
  ngOnInit(): void {
    this.questionId = Number(this.route.snapshot.paramMap.get('question')); 
    this.ptsdTestService.getFablesQuestions().subscribe({
      next: (data) => {
        this.test = this.ptsdTestService.getTest();
        this.questions = data;
        this.question = this.getQuestion(this.questionId);
        this.answer = this.test.fables.find((e: { questionId: number; }) => e.questionId === this.questionId);
        if(this.answer) {
          this.answerForm.patchValue({
            answer: this.answer.answer.toString()
          });
        }
        if(this.test.gender == "b") {
          this.gender = "b"
        }
        this.isLoading = false;
      }
    });

    this.translocoService.langChanges$.subscribe(lang => {
      this.lang = lang;
    });
    
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
          // Show progress spinner or progress bar
          console.log('Route change detected');
      }

      if (event instanceof NavigationEnd) {
          // Hide progress spinner or progress bar
          //this.currentRoute = event.url;
          this.questionId = Number(this.route.snapshot.paramMap.get('question')); 
          this.question = this.getQuestion(this.questionId);
          this.answer = this.test.fables.find((e: { questionId: number; }) => e.questionId === this.questionId);
          if(this.answer) {
            this.answerForm.patchValue({
              answer: this.answer.answer.toString()
            });
          }
          // console.log(this.route);
      }

      if (event instanceof NavigationError) {
           // Hide progress spinner or progress bar

          // Present error to user
          console.log(event.error);
      }
    });
  }

  getQuestion(id: number) {
    let question = this.questions.find((question, index) => {
      this.prevQuestion = this.questions[index - 1] || undefined;
      this.nextQuestion = this.questions[index + 1] || undefined;
      return question.id === id;
    }) || null;
    return question;
  }

  onSubmit() {
    console.log(this.answerForm.value);
    if(this.test.fables) {
      this.answer = this.test.fables.find((e: { questionId: number; }) => e.questionId === this.questionId);
      if(this.answer) {
        this.answer.answer = Number(this.answerForm.value.answer);
      } else {
        this.test.fables = [...this.test.fables, {questionId: this.questionId, answer: Number(this.answerForm.value.answer)}];
        // this.answers.push({questionId: this.questionId, answer: Number(this.answerForm.value.answer)});
      }
    } else {
      this.test.fables = [{questionId: this.questionId, answer: Number(this.answerForm.value.answer)}];
    }
    this.ptsdTestService.setTest(this.test);
    this.answerForm.patchValue({
      answer: ''
    });
    if(this.nextQuestion) {
      this.router.navigate([this.lang, 'ptsd-test-fables', this.questionId + 1 ]);
    } else {
      // this.router.navigate(['/ptsd-test-lusher']);
      this.router.navigate([this.lang, 'ptsd-test-lusher-start']);
      // this.ptsdTestService.submit().subscribe({
      //   next: (response) => {
      //     this.isLoading = false;
      //     console.log(response);
      //     if(response.body) {
      //       this.router.navigate(['/ptsd-test-result', this.ptsdTestService.getTestId()]);
      //     }
      //     // if(response.body?.id) {
      //     //   this.ptsdTestService.setTestId(response.body.id);
      //     // }
      //   },
      //   error: (error) => {
      //     this.isLoading = false;
      //     console.error(error);
      //   }
      // });
    }
  }

}
