import { Routes } from '@angular/router';
import { ProjectListPageComponent } from './project-list-page/project-list-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { ProjectPageComponent } from './project-page/project-page.component';

export const routes: Routes = [
    {path: 'login', component: LoginPageComponent},
    {path: 'projects', component: ProjectListPageComponent},
    {path: 'project/:projectId', component: ProjectPageComponent},
    {path: '**', component: LoginPageComponent},
];
