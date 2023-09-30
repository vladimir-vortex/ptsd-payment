import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { NavigationEnd, Router, Scroll } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { fadeAnimation } from './animations';
import { SidenavService } from 'src/app/services/sidenav.service';
import { MatDialog } from '@angular/material/dialog';
import { CookieDialodComponent } from './shared/components/cookie-dialod/cookie-dialod.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
  animations: [fadeAnimation]
})

export class AppComponent implements OnInit {
  title = 'ptsd-test-3';
  url = '';

  @ViewChild('sidenav')
  public sidenav!: MatSidenav;

  constructor(
    private router: Router,
    private translocoService: TranslocoService,
    private sidenavService: SidenavService,
    private dialog: MatDialog,

  ) {
    router.events.subscribe((evt) => { // will trigger each time there's a route change.
      if(evt instanceof NavigationEnd) {
        this.url = evt.url;
        this.sidenav.close();
      }
    });
  }

  lang = "en";
  lang_default = "en";

  ngOnInit(): void {
    this.translocoService.langChanges$.subscribe(lang => {
      this.lang = lang;
    });
  }

  ngAfterViewInit(): void {
    this.sidenavService.setSidenav(this.sidenav);
    const expiredCookieStr = localStorage.getItem('acept_cookie');
    const expiredCookie = parseInt(expiredCookieStr || '0');
    if(expiredCookie < Date.now()) {
      this.openDialog();
    }
  }

  closeSidenav() {
    this.sidenav.close();

  }

  openDialog() {    
    const dialogRef = this.dialog.open(CookieDialodComponent, {
      panelClass: 'tm-dialog-container'
      // width: '100%',
      // position: { bottom: '32px' },
      // hasBackdrop: false,
      // panelClass: 'w-full',
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        localStorage.setItem('acept_cookie', Math.floor(Date.now() + 1000 * 60 * 60 * 24).toString());
      }
    });

  };

}
