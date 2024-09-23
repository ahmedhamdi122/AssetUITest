import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ModulesWithPermissionsVM } from 'src/app/Shared/Models/Module';
import { ListRoleCategoriesVM } from 'src/app/Shared/Models/rolecategoryVM';
import { CreateRoleVM } from 'src/app/Shared/Models/roleVM';
import { RoleService } from 'src/app/Shared/Services/role.service';
import { RoleCategoryService } from 'src/app/Shared/Services/rolecategory.service';
interface Permission {
  moduleName: string;
  add: boolean;
  edit: boolean;
  delete: boolean;
  exportExcel: boolean;
  exportPdf: boolean;
}
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})


export class CreateComponent implements OnInit {
  public lang = localStorage.getItem("lang");
  form: FormGroup;
  roleObj: CreateRoleVM;
  lstRoleCategories: ListRoleCategoriesVM[] = [];
  lstModuleWithPermssions:ModulesWithPermissionsVM[];
  errorMessage: string ;
  errorDisplay: boolean = false;
  checked=false;
  dir=this.lang=='en'?'ltr':'rtl';
  isInvalidRoleCategory=true;
  noCheckedAnyPermissions=false;
  lsCheckedModulesWithPermissions:ModulesWithPermissionsVM[];
  constructor(private roleService: RoleService, private rolecategoryService: RoleCategoryService, private formBuilder: FormBuilder, private ref: DynamicDialogRef,private conf:DynamicDialogConfig) {
    this.form = this.formBuilder.group({
      name: [null, Validators.required],
      displayName:[null, Validators.required],
    });
  }
  validateRoleCategory()
  {
      this.isInvalidRoleCategory=!this.roleObj.roleCategoryId;
  }
  ngOnInit(): void {
    this.roleObj={roleCategoryId:null,name:'',displayName:'',ModulesWithPermissionsVM:[]};
   this.lstRoleCategories=this.conf.data.rolecategoryRes;
   this.lstModuleWithPermssions=this.conf.data.ModuleWithPermissionRes;   
   
  }
  getPermissionValue(ModulesWithPermissions:ModulesWithPermissionsVM,permission:string)
  {
    var per=ModulesWithPermissions.permissions.find(p=>p.name===permission)
    if(per)return per.value;
    return false;
  }
  updatePermissionValue(ModulesWithPermissions:ModulesWithPermissionsVM,permission:string,value:boolean)
  {
    var per=ModulesWithPermissions.permissions.find(p=>p.name===permission)
    if(per) per.value=value;
    this.noCheckedAnyPermissions=!this.anyPermissionChecked();

  }
  hasPermission(rowIndex:number,permission:string)
  {
    return this.lstModuleWithPermssions[rowIndex].permissions.some(p=>p.name===permission);
  }
 
  anyPermissionChecked(): boolean {
    return this.lstModuleWithPermssions.some(module => 
        module.permissions.some(permission => permission.value === true)
    );
}
  onSubmit() {
    if(this.roleObj.roleCategoryId == null)
    {
      this.isInvalidRoleCategory=true;
      this.errorDisplay = true;
      if(this.lang == "en")
      {
     this.errorMessage ="Please select category";
     return false;
      }
      else if(this.lang == "ar")
      {
        this.errorMessage ="من فضلك اختر فئة";
        return false;
      }
    }
    else if(this.roleObj.name == '')
      {
        this.errorDisplay = true;
        if(this.lang == "en")
        {
       this.errorMessage ="Please insert Name";
       return false;
        }
        else if(this.lang == "ar")
        {
          this.errorMessage ="من فضلك ادخل اسم";
          return false;
        }
      }
    else if(this.roleObj.displayName == '')
      {
        this.errorDisplay = true;
        if(this.lang == "en")
        {
       this.errorMessage ="Please select displayName";
       return false;
        }
        else if(this.lang == "ar")
        {
          this.errorMessage ="من فضلك اختر اسم العرض";
          return false;
        }
      }
    else if(!this.anyPermissionChecked())
      {
        this.noCheckedAnyPermissions=true;
        this.errorDisplay=true;
        if(this.lang=='en'){this.errorMessage='Please select at least one permission'}
        else this.errorMessage='من فضلك إضافة صلاحية واحده على الأقل'
        return false;
      }
    //  this.ref.close("craeted");

    this.lsCheckedModulesWithPermissions = this.lstModuleWithPermssions.map(module => ({...module,
      permissions: module.permissions.filter(permission => permission.value === true) // Filters permissions
  })).filter(module => module.permissions.length > 0);
     console.log("lsCheckedModulesWithPermissions :",this.lsCheckedModulesWithPermissions);
   // console.log("lstModuleWithPermssions :",this.lsCheckedModulesWithPermissions.forEach(mp=>mp.permissions.filter(p=>p.value===true)));
  

  
}
  
}
