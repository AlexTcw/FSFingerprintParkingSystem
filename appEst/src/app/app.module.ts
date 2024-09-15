import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatListModule} from "@angular/material/list";
import {MatDividerModule} from "@angular/material/divider";
import {NgOptimizedImage} from "@angular/common";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {HttpClientModule} from "@angular/common/http";
import {MatDialogModule} from "@angular/material/dialog";
import {MatChipsModule} from "@angular/material/chips";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatRadioModule} from "@angular/material/radio";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSelectModule} from "@angular/material/select";
import { HomeComponent } from './components/home/home.component';
import { ActiveParkComponent } from './components/dashboard/active-park/active-park.component';
import { ActiveUsersComponent } from './components/dashboard/active-users/active-users.component';
import { MainComponent } from './components/dashboard/main/main.component';
import { HistoricComponent } from './components/dashboard/historic/historic.component';
import { SettingsComponent } from './components/dashboard/settings/settings.component';
import { SidenavComponent } from './components/dashboard/sidenav/sidenav/sidenav.component';
import { SidenavBodyComponent } from './components/dashboard/sidenav/sidenav-body/sidenav-body.component';
import { SidenavUtilComponent } from './components/dashboard/sidenav/sidenav-util/sidenav-util.component';
import { DashboardHomeComponent } from './components/dashboard/dashboard-home/dashboard-home.component';
import {MatTabsModule} from "@angular/material/tabs";
import { ClockComponent } from './shared/clock/clock.component';
import { RegisterComponent } from './components/registryManagment/register/register.component';
import { ConsultComponent } from './components/registryManagment/consult/consult.component';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import { RegPageComponent } from './shared/reg-page/reg-page.component';
import {UsrConfComponent} from "./shared/users/usr-conf/usr-conf.component";
import { DetailsUsrComponent } from './components/dashboard/details-usr/details-usr.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ActiveParkComponent,
    ActiveUsersComponent,
    MainComponent,
    HistoricComponent,
    SettingsComponent,
    SidenavComponent,
    SidenavBodyComponent,
    SidenavUtilComponent,
    DashboardHomeComponent,
    ClockComponent,
    RegisterComponent,
    ConsultComponent,
    RegPageComponent,
    UsrConfComponent,
    DetailsUsrComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatListModule,
        MatDividerModule,
        NgOptimizedImage,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatInputModule,
        HttpClientModule,
        MatDialogModule,
        MatChipsModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        MatRadioModule,
        FormsModule,
        MatTableModule,
        MatPaginatorModule,
        MatSelectModule,
        MatTabsModule,
        MatDatepickerModule,
        MatNativeDateModule,

    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
