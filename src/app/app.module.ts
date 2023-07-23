import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { PtsdTestComponent } from './pages/ptsd-test/ptsd-test.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PtsdTestStartComponent } from './pages/ptsd-test-start/ptsd-test-start.component';
import { PtsdTestResultComponent } from './pages/ptsd-test-result/ptsd-test-result.component';
import { SharedModule } from './shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PtsdTestLusherComponent } from './pages/ptsd-test-lusher/ptsd-test-lusher.component';
import { PtsdTestFablesComponent } from './pages/ptsd-test-fables/ptsd-test-fables.component';
import { TranslocoRootModule } from './transloco-root.module';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { TermsOfUseComponent } from './pages/terms-of-use/terms-of-use.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PtsdTestComponent,
    PtsdTestStartComponent,
    PtsdTestResultComponent,
    PtsdTestLusherComponent,
    PtsdTestFablesComponent,
    PrivacyPolicyComponent,
    TermsOfUseComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SharedModule,
    ReactiveFormsModule,
    TranslocoRootModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
