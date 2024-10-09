import { ModuleIdsWithPermissionsVM } from "./Module";

export class ListRolesVM {
    id: string = "";
    name: string = "";
    displayName: string = "";
    categoryName:string="";
}
export class CreateRoleVM {
    name: string = "";
    roleCategoryId: number ;
    displayName: string = "";
    ModuleIdsWithPermissions:ModuleIdsWithPermissionsVM[];
}
export class EditRoleVM {
    id: string = "";
    roleCategoryId: number;
    name: string = "";
    displayName: string = "";
    ModuleIdsWithPermissions:ModuleIdsWithPermissionsVM[];
}
export class RolesResult
{
    results: ListRolesVM[];
    count: number;
}
export class RoleVM{
    id:string;
    name:string;
    displayName:string;
    roleCategory:roleCategoryVM;
}
export class roleCategoryVM{
    id:number;
    name:string;
    nameAr:string;
}