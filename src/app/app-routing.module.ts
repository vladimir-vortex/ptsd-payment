import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PtsdTestFablesComponent } from './pages/ptsd-test-fables/ptsd-test-fables.component';
import { PtsdTestLusherComponent } from './pages/ptsd-test-lusher/ptsd-test-lusher.component';
import { PtsdTestResultComponent } from './pages/ptsd-test-result/ptsd-test-result.component';
import { PtsdTestStartComponent } from './pages/ptsd-test-start/ptsd-test-start.component';
import { PtsdTestComponent } from './pages/ptsd-test/ptsd-test.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'ptsd-test', component: PtsdTestStartComponent },
  { path: 'ptsd-test/:question', component: PtsdTestComponent },
  { path: 'ptsd-test-fables/:question', component: PtsdTestFablesComponent },
  { path: 'ptsd-test-lusher', component: PtsdTestLusherComponent },
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
