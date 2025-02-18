import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DashboardadminComponent } from './components/dashboardadmin/dashboardadmin.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CodeEditorComponent } from './components/code-editor/code-editor.component';
import { QuestionsComponent } from './components/questions/questions.component';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { UtulisateursComponent } from './components/utulisateurs/utulisateurs.component';
import { ToututulisateursComponent } from './components/toututulisateurs/toututulisateurs.component';
import { DashboardsuperadminComponent } from './components/dashboardsuperadmin/dashboardsuperadmin.component';
import { ThemeService } from './service/theme.service';
import { SplashScreenComponent } from './components/splash-screen/splash-screen.component';
import { AccountDetailsComponent } from './components/account-details/account-details.component';
import { GroupManagementComponent } from './components/group-management/group-management.component';

// CodeMirror imports
import 'codemirror/lib/codemirror';
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/python/python';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/selection/active-line';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    DashboardComponent,
    DashboardadminComponent,
    NavbarComponent,
    SidebarComponent,
    CodeEditorComponent,
    QuestionsComponent,
    UtulisateursComponent,
    ToututulisateursComponent,
    DashboardsuperadminComponent,
    SplashScreenComponent,
    AccountDetailsComponent,
    GroupManagementComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    CodemirrorModule

  ],
  providers: [
    ThemeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
