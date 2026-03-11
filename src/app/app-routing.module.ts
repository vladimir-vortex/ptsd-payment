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
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { PaymentReturnComponent } from './pages/payment-return/payment-return.component';
import { TestAuthGuard } from './guards/test-auth.guard';
import { AuthorComponent } from './pages/author/author.component';

const routes: Routes = [
  // { path: '', component: HomeComponent, resolve: [LangGuard] },
  {
    path: '',
    redirectTo: '/en',
    pathMatch: 'full'
  },
  { path: ':lang', component: HomeComponent, resolve: [LangGuard] },
  {
    // Страница авторизации и оплаты: email → OTP → LiqPay
    path: ':lang/checkout',
    component: CheckoutComponent,
    resolve: [LangGuard],
  },
  {
    // Возврат с LiqPay: искусственная задержка + поллинг статуса оплаты
    path: ':lang/payment-return',
    component: PaymentReturnComponent,
    resolve: [LangGuard],
  },
  { path: ':lang/ptsd-test', 
    component: PtsdTestStartComponent,
    canActivate: [TestAuthGuard],
    resolve: [LangGuard] 
  },
  { 
    path: ':lang/ptsd-test/:question',
    component: PtsdTestComponent, 
    canActivate: [TestAuthGuard],
    resolve: [LangGuard] 
  },
  {
    path: ':lang/ptsd-test-fables/start',
    component: PtsdTestFablesStartComponent,
    canActivate: [TestAuthGuard],
    resolve: [LangGuard] 
  },
  { 
    path: ':lang/ptsd-test-fables/:question',
    component: PtsdTestFablesComponent,
    canActivate: [TestAuthGuard],
    resolve: [LangGuard] 
  },
  {
    path: ':lang/ptsd-test-lusher-start', 
    component: PtsdTestLusherStartComponent,
    canActivate: [TestAuthGuard],
    resolve: [LangGuard] 
  },
  {
    path: ':lang/ptsd-test-lusher',
    component: PtsdTestLusherComponent,
    canActivate: [TestAuthGuard],
    resolve: [LangGuard]
  },
  { path: ':lang/terms-of-use', component: TermsOfUseComponent, resolve: [LangGuard] },
  { path: ':lang/privacy-policy', component: PrivacyPolicyComponent, resolve: [LangGuard] },
  { path: ':lang/author', component: AuthorComponent, resolve: [LangGuard] },
  { path: ':lang/about', component: AboutComponent, resolve: [LangGuard] },
  // { path: 'ptsd-test-result/:id', component: PtsdTestResultComponent, resolve: [LangGuard] },
  { path: ':lang/ptsd-test-result/:id', component: PtsdTestResultComponent, resolve: [LangGuard] },
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
