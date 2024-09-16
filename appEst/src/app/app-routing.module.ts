import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {MainComponent} from "./components/dashboard/main/main.component";
import {SettingsComponent} from "./components/dashboard/settings/settings.component";
import {DashboardHomeComponent} from "./components/dashboard/dashboard-home/dashboard-home.component";
import {ActiveParkComponent} from "./components/dashboard/active-park/active-park.component";
import {ActiveUsersComponent} from "./components/dashboard/active-users/active-users.component";
import {HistoricComponent} from "./components/dashboard/historic/historic.component";
import {RegisterComponent} from "./components/registryManagment/register/register.component";
import {ConsultComponent} from "./components/registryManagment/consult/consult.component";
import {DetailsUsrComponent} from "./components/dashboard/details-usr/details-usr.component";
import {authGuard} from "./auth/guards/auth.guard";

const routes: Routes = [
  /*Main components*/
  {path: 'home', component: HomeComponent},
  {path: 'register', component:RegisterComponent},
  {path: 'consult', component:ConsultComponent},
  {path: 'dashboard',
    /*Dash modules*/
    component:MainComponent,
    canActivate: [authGuard],
    children:[
      {path: 'settings', component: SettingsComponent},
      {path: 'dashboard-home', component: DashboardHomeComponent},
      {path: 'active-park', component: ActiveParkComponent},
      {path: 'active-users', component:ActiveUsersComponent},
      {path: 'active-users/details/:cveusr', component: DetailsUsrComponent },
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
