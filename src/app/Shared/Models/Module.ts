import { PermissionVM } from "./Permissions";

export class ModulesWithPermissionsVM{
    id:number;
    name:string;
    nameAr:string;
    permissions:PermissionVM[];
}
export class ModuleIdsWithPermissionsVM
{
    moduleId:number;
    permissionIDs:number[]
}
