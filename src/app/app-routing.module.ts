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

const routes: Routes = [
  // { path: '', component: HomeComponent, resolve: [LangGuard] },
  {
    path: '',
    redirectTo: '/en',
    pathMatch: 'full'
  },
  { path: ':lang', component: HomeComponent, resolve: [LangGuard] },
  { path: ':lang/ptsd-test', component: PtsdTestStartComponent, resolve: [LangGuard] },
  { path: ':lang/terms-of-use', component: TermsOfUseComponent, resolve: [LangGuard] },
  { path: ':lang/privacy-policy', component: PrivacyPolicyComponent, resolve: [LangGuard] },
  { path: ':lang/about', component: AboutComponent, resolve: [LangGuard] },
  { path: ':lang/ptsd-test/:question', component: PtsdTestComponent, resolve: [LangGuard] },
  { path: ':lang/ptsd-test-fables/start', component: PtsdTestFablesStartComponent, resolve: [LangGuard] },
  { path: ':lang/ptsd-test-fables/:question', component: PtsdTestFablesComponent, resolve: [LangGuard] },
  { path: ':lang/ptsd-test-lusher-start', component: PtsdTestLusherStartComponent, resolve: [LangGuard] },
  { path: ':lang/ptsd-test-lusher', component: PtsdTestLusherComponent, resolve: [LangGuard] },
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
