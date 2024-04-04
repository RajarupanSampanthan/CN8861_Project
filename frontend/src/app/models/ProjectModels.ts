
export{
    GetProjectsResponse,
    Project
}

class GetProjectsResponse{
    didSucceed : boolean = false;
    projects : Project[] = [];
}


class Project {
    fileName : string = "";
    projectId : string = "";
}