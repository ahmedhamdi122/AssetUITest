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
    roleCategoryId: number = 0;
    name: string = "";
    displayName: string = "";
}
export class RolesResult
{
    results: ListRolesVM[];
    count: number;
}
export class RoleVM{
    name:string;
    displayName:string;
    categoryName:RoleCategoryNamesVM;
}
export class RoleCategoryNamesVM{
    name:string;
    nameAr:string;
}