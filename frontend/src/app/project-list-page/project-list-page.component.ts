import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from '../services/backend.service';
import { Project } from '../models/ProjectModels';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-list-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-list-page.component.html',
  styleUrl: './project-list-page.component.css'
})
export class ProjectListPageComponent implements OnInit {  

  projects : Project[] = []
  
  
constructor(private backendService : BackendService, private router: Router){
}

ngOnInit() {

  this.backendService.GetProjectsRequest().subscribe(
    response => {
      if (response.didSucceed){
        console.log(response.projects)
        this.projects = response.projects
      }
    },
    error => {
      console.log(`Login failed!! You do not have access to GNS3 server.`)
    }
  );
}

GoToProject(id : string){
  this.router.navigate(['/project',id])
}

}
