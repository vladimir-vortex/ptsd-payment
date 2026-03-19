import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { LangGuard } from './lang/lang.guard';
import { AboutComponent } from './pages/about/about.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { PtsdTestFablesStartComponent } from './pages/ptsd-test-fables-start/ptsd-test-fables-start.component';
import { PtsdTestFablesComponent } from './pages/ptsd-test-fables/ptsd-test-fables.component';
import { PtsdTestLusherStartComponent } from './pages/ptsd-test-lusher-start/ptsd-test-lusher-start.component';
import { PtsdTestLusherComponent } from './pages/ptsd-test-lusher/ptsd-test-lusher.component';
import { PtsdTestResultComponent } from './pages/ptsd-test-result/ptsd-test-result.component';
import { PtsdTestStartComponent } from './pages/ptsd-test-start/ptsd-test-start.component';
import { PtsdTestComponent } from './pages/ptsd-test/ptsd-test.component';
import { TermsOfUseComponent } from './pages/terms-of-use/terms-of-use.component';
import { PaymentReturnComponent } from './pages/payment-return/payment-return.component';
import { TestAuthGuard } from './guards/test-auth.guard';
import { AuthorComponent } from './pages/author/author.component';
import { PtsdAuthRequestComponent } from './pages/ptsd-auth-request/ptsd-auth-request.component';
import { PtsdAuthVerifyComponent } from './pages/ptsd-auth-verify/ptsd-auth-verify.component';
import { PtsdPaymentComponent } from './pages/ptsd-payment/ptsd-payment.component';
import { LangRedirectComponent } from './lang/lang-redirect.component';
import { PtsdTestCompleteComponent } from './pages/ptsd-test-complete/ptsd-test-complete.component';

const routes: Routes = [
  {
    path: '',
    component: LangRedirectComponent,
    pathMatch: 'full'
  },
  {
    path: 'payment-return',
    component: LangRedirectComponent,
    pathMatch: 'full'
  },
  {
    path: ':lang/ptsd-test/auth-request',
    component: PtsdAuthRequestComponent,
    resolve: [LangGuard],
  },
  {
    path: ':lang/ptsd-test/auth-verify',
    component: PtsdAuthVerifyComponent,
    resolve: [LangGuard],
  },
  {
    path: ':lang/ptsd-test/payment',
    component: PtsdPaymentComponent,
    resolve: [LangGuard],
  },
  {
    path: ':lang/payment-return',
    component: PaymentReturnComponent,
    resolve: [LangGuard],
  },
  {
    path: ':lang/ptsd-test',
    canActivate: [TestAuthGuard],
    resolve: [LangGuard],
    children: [
      { path: '', component: PtsdTestStartComponent },
      { path: 'question/:question', component: PtsdTestComponent },
      { path: 'fables/start', component: PtsdTestFablesStartComponent },
      { path: 'fables/:question', component: PtsdTestFablesComponent },
      { path: 'lusher/start', component: PtsdTestLusherStartComponent },
      { path: 'lusher', component: PtsdTestLusherComponent },
      { path: 'complete', component: PtsdTestCompleteComponent },
    ]
  },
  { path: ':lang/terms-of-use', component: TermsOfUseComponent, resolve: [LangGuard] },
  { path: ':lang/privacy-policy', component: PrivacyPolicyComponent, resolve: [LangGuard] },
  { path: ':lang/author', component: AuthorComponent, resolve: [LangGuard] },
  { path: ':lang/about', component: AboutComponent, resolve: [LangGuard] },
  { path: ':lang/ptsd-test-result/:id', component: PtsdTestResultComponent, resolve: [LangGuard] },
  { path: ':lang', component: HomeComponent, resolve: [LangGuard] },
  { path: ':lang/:any-page', component: NotFoundComponent, resolve: [LangGuard] },
  { path: '**', component: NotFoundComponent, resolve: [LangGuard] },
];


const routerOptions: ExtraOptions = {
  anchorScrolling: 'enabled',
  scrollPositionRestoration: 'top',
  onSameUrlNavigation: 'reload'
};

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
