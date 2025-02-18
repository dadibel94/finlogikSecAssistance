import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CodeEditorComponent } from './components/code-editor/code-editor.component';
import { QuestionsComponent } from './components/questions/questions.component';
import { DashboardadminComponent } from './components/dashboardadmin/dashboardadmin.component';
import { DashboardsuperadminComponent } from './components/dashboardsuperadmin/dashboardsuperadmin.component';
import { UtulisateursComponent } from './components/utulisateurs/utulisateurs.component';
import { ToututulisateursComponent } from './components/toututulisateurs/toututulisateurs.component';
import { AccountDetailsComponent } from './components/account-details/account-details.component';
import { GroupManagementComponent } from './components/group-management/group-management.component';

// Définir la route par défaut pour rediriger vers la page de login
const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'editor', component: CodeEditorComponent },
  { path: 'questions', component: QuestionsComponent },
  { path: 'dashboardadmin', component: DashboardadminComponent },
  { path: 'dashboardsuperadmin', component: DashboardsuperadminComponent },
  { path: 'utilisateurs', component: UtulisateursComponent },
  { path: 'toututilisateurs', component: ToututulisateursComponent },
  { path: 'account-details', component: AccountDetailsComponent },
  { path: 'group-management', component: GroupManagementComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
