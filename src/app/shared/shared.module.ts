import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { MaterialModule } from './material/material.module';
import { LoaderComponent } from './components/loader/loader.component';
import { TranslocoRootModule } from '../transloco-root.module';
import { CookieDialodComponent } from './components/cookie-dialod/cookie-dialod.component';
import { AccordionItemComponent } from './components/accordion/accordion-item.component';
import { PtsdUserBarComponent } from './components/ptsd-user-bar/ptsd-user-bar.component';
import { AlertComponent } from './components/alert/alert.component';
import { NgOtpInputModule } from 'ng-otp-input';


@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent,
    LoaderComponent,
    CookieDialodComponent,
    AccordionItemComponent,
    PtsdUserBarComponent,
    AlertComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    TranslocoRootModule,
    NgOtpInputModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    LoaderComponent,
    MaterialModule,
    CookieDialodComponent,
    AccordionItemComponent,
    PtsdUserBarComponent,
    AlertComponent,
    NgOtpInputModule
  ],
})
export class SharedModule { }
