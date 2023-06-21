import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PtsdTestResultComponent } from './pages/ptsd-test-result/ptsd-test-result.component';
import { PtsdTestStartComponent } from './pages/ptsd-test-start/ptsd-test-start.component';
import { PtsdTestComponent } from './pages/ptsd-test/ptsd-test.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'ptsd-test', component: PtsdTestStartComponent },
  { path: 'ptsd-test/:question', component: PtsdTestComponent },
  { path: 'ptsd-test-result/:id', component: PtsdTestResultComponent },
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
