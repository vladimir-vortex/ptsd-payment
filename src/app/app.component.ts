import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { fadeAnimation } from './animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
  animations: [fadeAnimation]
})

export class AppComponent {
  title = 'ptsd-test-3';
  url = '';
  constructor(private router: Router) {
    router.events.subscribe((evt) => { // will trigger each time there's a route change.
      if(evt instanceof NavigationEnd){
        this.url = evt.url;
      }
    });
  }
}
