import { PermissionVM, PermissionWithValueVM } from "./Permissions";

export class ModulesWithPermissionsVM{
    id:number;
    name:string;
    nameAr:string;
    permissions:PermissionVM[];
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
