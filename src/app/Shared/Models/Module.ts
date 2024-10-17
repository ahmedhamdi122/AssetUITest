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
export class ModuleWithPermissionNames
{
    moduleName:string;
    moduleNameAr:string;
    route :string;
    icon :string;
    permissionNames:string[]
}
export class SortSearchVM
{
    SortOrder: number;
    SortFiled: string;
    search: string;
}
export class SectionModulePermisisons {
    icon:string;
    sectionName:string;
    sectionNameAr:string;
    moduleWithPermissionNames:ModuleWithPermissionNames[];
    
}
