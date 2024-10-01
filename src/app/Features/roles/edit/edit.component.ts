import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ModulesWithPermissionsValueVM, ModulesWithPermissionsVM } from 'src/app/Shared/Models/Module';
import { ListRoleCategoriesVM } from 'src/app/Shared/Models/rolecategoryVM';
import { CreateRoleVM } from 'src/app/Shared/Models/roleVM';
import { RoleService } from 'src/app/Shared/Services/role.service';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit {
  public lang = localStorage.getItem("lang");
  form: FormGroup;
  EditRole: CreateRoleVM;
  lstRoleCategories: ListRoleCategoriesVM[] = [];
  ModulesWithPermssions:ModulesWithPermissionsValueVM[];
  errorMessage: string ;
  errorDisplay: boolean = false;
  checked=false;
  dir=this.lang=='en'?'ltr':'rtl';
  isInvalidRoleCategory=true;
  noCheckedAnyPermissions=false;
  lsCheckedModulesWithPermissions:ModulesWithPermissionsVM[];
  constructor( private ref: DynamicDialogRef,private conf:DynamicDialogConfig) {
 
  }
  validateRoleCategory()
  {
      this.isInvalidRoleCategory=!this.EditRole.roleCategoryId;
  }
  ngOnInit(): void {
    this.EditRole={roleCategoryId:null,name:'',displayName:'',ModuleIdsWithPermissions:[]};
   this.lstRoleCategories=this.conf.data.rolecategoryRes;
  this.ModulesWithPermssions=this.conf.data.ModuleWithPermissionRes.map(mwp=>({...mwp,permissions:mwp.permissions.map(p=>({...p,value:false}))}));  
  this.EditRole={name:"edit",displayName:"editDisplayName",roleCategoryId:2,
    ModuleIdsWithPermissions:[{moduleId:1,permissionIDs:[1,2,3,4]},{moduleId:3,permissionIDs:[1,2]},{moduleId:5,permissionIDs:[3,4]}]}
     console.log("this.EditRole.ModuleIdsWithPermissions :",this.EditRole.ModuleIdsWithPermissions);
   console.log(" this.ModulesWithPermssions",this.ModulesWithPermssions);


    this.EditRole.ModuleIdsWithPermissions.forEach(ModuleIdWithPermissions => {
    var obj=this.ModulesWithPermssions.find(m=>m.id==ModuleIdWithPermissions.moduleId)
    ModuleIdWithPermissions.permissionIDs.forEach(p=>{
      
    })
    });
  }
  getPermissionValue(ModulesWithPermissions:any,permission:string)
  {
    var per=ModulesWithPermissions.permissions.find(p=>p.name===permission)
    if(per)return per.value;
    return false;    
  }
  updatePermissionValue(ModulesWithPermissions:any,permission:string,value:boolean)
  {
    var per=ModulesWithPermissions.permissions.find(p=>p.name===permission)
    if(per) per.value=value;
    this.noCheckedAnyPermissions=!this.anyPermissionChecked();

  }
  hasPermission(rowIndex:number,permission:string)
  {
    return this.ModulesWithPermssions[rowIndex].permissions.some(p=>p.name===permission);
  }
 
  anyPermissionChecked(): boolean {
    return this.ModulesWithPermssions.some(module => 
        module.permissions.some(permission => permission.value === true)
    );
}
  onSubmit() {
    // if(this.EditRole.roleCategoryId == null)
    // {
    //   this.isInvalidRoleCategory=true;
    //   this.errorDisplay = true;
    //   if(this.lang == "en")
    //   {
    //  this.errorMessage ="Please select category";
    //  return false;
    //   }
    //   else if(this.lang == "ar")
    //   {
    //     this.errorMessage ="من فضلك اختر فئة";
    //     return false;
    //   }
    // }
    // else if(this.EditRole.name == '')
    //   {
    //     this.errorDisplay = true;
    //     if(this.lang == "en")
    //     {
    //    this.errorMessage ="Please insert Name";
    //    return false;
    //     }
    //     else if(this.lang == "ar")
    //     {
    //       this.errorMessage ="من فضلك ادخل اسم";
    //       return false;
    //     }
    //   }
    // else if(this.EditRole.displayName == '')
    //   {
    //     this.errorDisplay = true;
    //     if(this.lang == "en")
    //     {
    //    this.errorMessage ="Please select displayName";
    //    return false;
    //     }
    //     else if(this.lang == "ar")
    //     {
    //       this.errorMessage ="من فضلك اختر اسم العرض";
    //       return false;
    //     }
    //   }
    // else if(!this.anyPermissionChecked())
    //   {
    //     this.noCheckedAnyPermissions=true;
    //     this.errorDisplay=true;
    //     if(this.lang=='en'){this.errorMessage='Please select at least one permission'}
    //     else this.errorMessage='من فضلك إضافة صلاحية واحده على الأقل'
    //     return false;
    //   }
    this.EditRole.ModuleIdsWithPermissions = this.ModulesWithPermssions.map(module => ({
      moduleId:module.id,
      permissionIDs: module.permissions.filter(permission => permission.value === true).map(p=>p.id)
  })).filter(module => module.permissionIDs.length > 0);
  console.log("this.EditRole.ModuleIdsWithPermissions :",this.EditRole.ModuleIdsWithPermissions);
  
      this.ref.close(this.EditRole);

}
  
}
