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
export class SearchSortModuleVM
{
    SortOrder: number;
    SortFiled: string;
    Name: string;
    NameAr: string;
}
