import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ModulesPermissionsResult, SortSearchVM } from '../Models/Module';

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
  GetModulesWithPermissions(first:number,rows:number,SearchSortModuleObj:SortSearchVM):Observable<ModulesPermissionsResult>
  {
    return this.httpClient.post<ModulesPermissionsResult>(`${environment.GetModulesWithPermissions}/${first}/${rows}`,SearchSortModuleObj,this.httpHeader);
  }
}
