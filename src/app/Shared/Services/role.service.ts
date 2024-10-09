import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateRoleVM, EditRoleVM, ListRolesVM, RolesResult, RoleVM } from '../Models/roleVM';
import { Paging } from '../Models/paging';
import { SortSearchVM } from '../Models/rolecategoryVM';
import { ModulesPermissionsResult, ModulesPermissionsWithSelectedPermissionIDsResult } from '../Models/Module';



@Injectable({
  providedIn: 'root'
})

export class RoleService {

  constructor(private httpClient: HttpClient) {
  }

  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'
    })
  };
 
  GetRoles(first: number, rows: number, SortSearchObj: SortSearchVM): Observable<RolesResult> {
    return this.httpClient.post<RolesResult>(`${environment.ListRoles}${first}/${rows}`,SortSearchObj, this.httpHeader);
  }
  GetRolesWithPaging(pageInfo: Paging): Observable<ListRolesVM[]> {
    return this.httpClient.put<ListRolesVM[]>(`${environment.ListRolesWithPaging}`, pageInfo, this.httpHeader);
  }
  getCount(): Observable<number> {
    return this.httpClient.get<number>(`${environment.getRolescount}`);
  }
  GetRoleById(roleId: string): Observable<RoleVM> {
    return this.httpClient.get<RoleVM>(`${environment.GetRoleById}${roleId}`, this.httpHeader);
  }
  getModulesPermissionsbyRoleId(roleId: string,first:number,rows:number,sortSearchObj:SortSearchVM){
      return this.httpClient.post<ModulesPermissionsResult>(`${environment.getModulesPermissionsbyRoleId}${roleId}/modules-permissions/${first}/${rows}`,sortSearchObj, this.httpHeader);
    }

  // AddRoleToListById(id: string): Observable<EditRoleVM> {
  //   return this.httpClient.get<EditRoleVM>(`${environment.AddRoleToListById}${id}`, this.httpHeader);
  // }
  getModulesPermissionsbyRoleIdForEdit(roleId: string,first:number,rows:number,sortSearchObj:SortSearchVM){
    return this.httpClient.post<ModulesPermissionsWithSelectedPermissionIDsResult>(`${environment.getModulesPermissionsbyRoleIdForEdit}${roleId}/${first}/${rows}`,sortSearchObj, this.httpHeader);
  }


  GetRolesByRoleCategoryId(catId: number): Observable<ListRolesVM[]> {
    return this.httpClient.get<ListRolesVM[]>(`${environment.GetRolesByRoleCategoryId}${catId}`, this.httpHeader);
  }
  UpdateRole(editRoleObj: EditRoleVM): Observable<EditRoleVM> {
    return this.httpClient.put<EditRoleVM>(`${environment.UpdateRole}`, editRoleObj, this.httpHeader);
  }
  AddRole(createRoleObj: CreateRoleVM) {
    return this.httpClient.post<CreateRoleVM>(`${environment.AddRole}`, createRoleObj, this.httpHeader);
  }


  DeleteRole(id: string): Observable<any> {
    return this.httpClient.delete<any>(`${environment.DeleteRole}${id}`, this.httpHeader);
  }


}
