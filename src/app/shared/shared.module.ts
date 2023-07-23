import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { MaterialModule } from './material/material.module';
import { LoaderComponent } from './components/loader/loader.component';
import { TranslocoRootModule } from '../transloco-root.module';


@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent,
    LoaderComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    TranslocoRootModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    LoaderComponent,
    MaterialModule
  ],
})
export class SharedModule { }
