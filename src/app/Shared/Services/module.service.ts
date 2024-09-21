import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ModulesWithPermissionsVM } from '../Models/Module';

@Injectable({
  providedIn: 'root'
})
export class ModuleService {
  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'
    })}
  constructor(private httpClient:HttpClient) { }
  GetModulesWithPermissions():Observable<ModulesWithPermissionsVM[]>
  {
    return this.httpClient.get<ModulesWithPermissionsVM[]>(`${environment.GetModulesWithPermissions}`,this.httpHeader);
  }
}
