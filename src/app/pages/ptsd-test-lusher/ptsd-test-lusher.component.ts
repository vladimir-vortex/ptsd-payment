import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { map, tail, times, uniq, shuffle } from 'lodash';
import { PtsdTestService } from 'src/app/services/ptsd-test.service';

@Component({
  selector: 'app-ptsd-test-lusher',
  templateUrl: './ptsd-test-lusher.component.html',
  styleUrls: ['./ptsd-test-lusher.component.sass']
})
export class PtsdTestLusherComponent implements OnInit {

  constructor(
    private ptsdTestService: PtsdTestService,
    private route: ActivatedRoute,
    private router: Router,
    private translocoService: TranslocoService
  ) { }

  colors = [
    {
      id: 1,
      hex: '#004983',
      checked: false
    },
    {
      id: 2,
      hex: '#1D9772',
      checked: false
    },
    {
      id: 3,
      hex: '#F12F23',
      checked: false
    },
    {
      id: 4,
      hex: '#F2DD00',
      checked: false
    },
    {
      id: 5,
      hex: '#D42481',
      checked: false
    },
    {
      id: 6,
      hex: '#C55223',
      checked: false
    },
    {
      id: 7,
      hex: '#231F20',
      checked: false
    },
    {
      id: 8,
      hex: '#98938D',
      checked: false
    }
  ];

  lang = this.translocoService.getActiveLang();
  lang_default = this.translocoService.getDefaultLang();

  test: any;

  selectedColorsIdx: Number[] = [];

  isLoading = true;

  ngOnInit(): void {
    this.colors = shuffle(this.colors);
    this.test = this.ptsdTestService.getTest();

    this.translocoService.langChanges$.subscribe(lang => {
      this.lang = lang;
    });
  }

  selectColor(id: number): void {
    console.log('ColorId: ', id);
    let colorIdx = this.colors.findIndex(e => e.id === id);
    this.colors[colorIdx].checked = true;
    this.selectedColorsIdx.push(id);
    let color = this.colors.find(e => e.checked === false);
    if(!color) {
      this.test.lusher = this.selectedColorsIdx;
      this.ptsdTestService.setTest(this.test);
      this.ptsdTestService.submit().subscribe({
        next: (response) => {
          this.isLoading = false;
          console.log(response);
          if(response.body) {
            this.router.navigate([this.lang, 'ptsd-test-result', this.ptsdTestService.getTestId()]);
          }
          // if(response.body?.id) {
          //   this.ptsdTestService.setTestId(response.body.id);
          // }
        },
        error: (error) => {
          this.isLoading = false;
          console.error(error);
        }
      });
    }
  }

}
