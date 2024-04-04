import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BackendService } from './services/backend.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ProjectListPageComponent } from './project-list-page/project-list-page.component';
import { ProjectPageComponent } from './project-page/project-page.component';
import { SketchpadComponent } from './sketchpad/sketchpad.component';
import { ConfigPanelComponent } from './config-panel/config-panel.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    ConfigPanelComponent,
    HttpClientModule,
    FormsModule,
    LoginPageComponent,
    ProjectListPageComponent,
    ProjectPageComponent,
    ReactiveFormsModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    SketchpadComponent
  ],
  providers :[
    BackendService
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}
