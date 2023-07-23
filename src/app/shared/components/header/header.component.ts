import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {

  constructor(
    private router: Router,
    private translocoService: TranslocoService
  ) { }

  lang = "en";
  lang_default = "en";
  langs: any;
  routerEvents: any;
  currentUrl = "";
  currentLang: any;

  ngOnInit(): void {

    this.langs = this.translocoService.getAvailableLangs();
    this.lang_default = this.translocoService.getDefaultLang();

    this.translocoService.langChanges$.subscribe(lang => {
      this.lang = lang;
      this.currentLang = this.langs.find((e: { id: string; }) => e.id === this.lang);
    });

    this.currentLang = this.langs.find((e: { id: string; }) => e.id === this.lang);

    this.routerEvents = this.router.events.subscribe(
      (event:any)=>{
        if(event instanceof NavigationEnd){
          let url = event.url.split('/');
          url.splice(1, 1);
          this.currentUrl = url.join('/');
          // Prints the current route
          // Eg.- /products
        }
      }
    )
  }

}
