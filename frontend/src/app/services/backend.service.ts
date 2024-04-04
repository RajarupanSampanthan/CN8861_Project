import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Console } from 'console';
import { Observable, map } from 'rxjs';
import { LoginRequest, LoginResponse } from '../models/LoginModels';
import { GetProjectsResponse } from '../models/ProjectModels';
import { GetTopologyResponse, Topology } from '../models/TopologyModels';
import { OspfConfiguration, OspfConfigurationResponse } from '../models/OspfModels';


@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private _username : string = ""
  private _password : string = ""

  private options = {
    responseType: 'text' as const,
  };

  private headers = { 'Content-Type': 'application/json', 'My-Custom-Header': 'foobar' }

  private GetBaseParams() : HttpParams {
    let params = new HttpParams();
    params = params.append('username', this._username);
    params = params.append('password', this._password);
    return params

  }

  constructor(private http : HttpClient) { }

  UpdateUsernameAndPassword(username : string, password : string){
    this._username = username
    this._password = password
  }

  LoginRequest(loginRequest : LoginRequest): Observable<LoginResponse> {

    let params = new HttpParams();
    params = params.append('username', loginRequest.username);
    params = params.append('password', loginRequest.password);

    return this.http.get<LoginResponse>("/api/login", { params: params } );
  }

  GetProjectsRequest() : Observable<GetProjectsResponse> {
    let params = this.GetBaseParams()
    return this.http.get<GetProjectsResponse>("/api/projects", { params: params }) as Observable<GetProjectsResponse>;
  }

  GetTopologyRequest(projectId : string) : Observable<GetTopologyResponse> {
    let params = this.GetBaseParams()
    params = params.append('projectId', projectId)
    return this.http.get<GetTopologyResponse>("/api/topology", { params: params }) as Observable<GetTopologyResponse>;
  }

  SendOspfConfiguration(topology : Topology, configuration : OspfConfiguration  ) : Boolean {
    let params = this.GetBaseParams()
    // params = params.append('topology', JSON.stringify(topology))
    // params = params.append('configuration', JSON.stringify(configuration))
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    var httpOptions = {
      headers: new HttpHeaders({
          'Accept':'application/json',
          'Content-Type': 'application/json'
      })
  };
    const body  = { params: params, topology : topology, configuration : configuration }
    this.http.post("/api/ospf", body, httpOptions ).subscribe(
      response => {
        console.log(response)
      }
    );
    return false
  }
}
