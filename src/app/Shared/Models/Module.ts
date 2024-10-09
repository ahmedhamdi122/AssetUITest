import { PermissionVM, PermissionWithValueVM } from "./Permissions";

export class ModuleWithPermissionsVM{
    id:number;
    name:string;
    nameAr:string;
    permissions:PermissionVM[];
}
export class ModulesPermissionsResult 
{
    results:ModuleWithPermissionsVM[];
    count:number;
}
export class ModulesPermissionsWithSelectedPermissionIDsResult 
{
    results:ModulePermissionsWithSelectedPermissionIdsVM[];
    count:number;
}
export class ModulePermissionsWithSelectedPermissionIdsVM
{
    id:number;
    name:string;
    nameAr:string;
    permissions:PermissionVM[];
    selectedPemrissionIDs:number[];
}
export class ModulesWithPermissionsValueVM{
    id:number;
    name:string;
    nameAr:string;
    permissions:PermissionWithValueVM[];
}
export class ModuleIdsWithPermissionsVM
{
    moduleId:number;
    permissionIDs:number[]
}
export class SortSearchVM
{
    SortOrder: number;
    SortFiled: string;
    search: string;
}
