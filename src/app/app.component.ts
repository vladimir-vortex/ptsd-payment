import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { fadeAnimation } from './animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
  animations: [fadeAnimation]
})

export class AppComponent implements OnInit {
  title = 'ptsd-test-3';
  url = '';

  constructor(
    private router: Router,
    private translocoService: TranslocoService
  ) {
    router.events.subscribe((evt) => { // will trigger each time there's a route change.
      if(evt instanceof NavigationEnd){
        this.url = evt.url;
      }
    });
  }

  isLoading = true;

  ngOnInit(): void {
    this.translocoService.langChanges$.subscribe(() => {
      this.isLoading = false;
    });
  }
}
