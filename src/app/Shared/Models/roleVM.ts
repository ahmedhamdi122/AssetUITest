import { ModulesWithPermissionsVM } from "./Module";

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
    ModulesWithPermissionsVM:ModulesWithPermissionsVM[];
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