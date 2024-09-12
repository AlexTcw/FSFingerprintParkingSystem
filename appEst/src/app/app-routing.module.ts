import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {MainComponent} from "./components/dashboard/main/main.component";
import {SettingsComponent} from "./components/dashboard/settings/settings.component";
import {DashboardHomeComponent} from "./components/dashboard/dashboard-home/dashboard-home.component";
import {ActiveParkComponent} from "./components/dashboard/active-park/active-park.component";
import {ActiveUsersComponent} from "./components/dashboard/active-users/active-users.component";
import {HistoricComponent} from "./components/dashboard/historic/historic.component";

const routes: Routes = [
  /*Main components*/
  {path: 'home', component: HomeComponent},
  {path: 'dashboard',
    /*Dash modules*/
    component:MainComponent,
    children:[
      {path: 'settings', component: SettingsComponent},
      {path: 'dashboard-home', component: DashboardHomeComponent},
      {path: 'active-park', component: ActiveParkComponent},
      {path: 'active-users', component:ActiveUsersComponent},
      {path: 'history', component:HistoricComponent},
      {path: '', redirectTo: 'dashboard-home', pathMatch: 'full'}
    ]
  },
  /*redirect*/
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: '**', redirectTo: 'home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
