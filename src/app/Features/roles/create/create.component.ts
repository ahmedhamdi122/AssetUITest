import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { el } from '@fullcalendar/core/internal-common';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ModulesPermissionsResult, ModulesWithPermissionsValueVM, ModuleWithPermissionsVM, SortSearchVM } from 'src/app/Shared/Models/Module';
import { ListRoleCategoriesVM } from 'src/app/Shared/Models/rolecategoryVM';
import { CreateRoleVM } from 'src/app/Shared/Models/roleVM';
import { ModuleService } from 'src/app/Shared/Services/module.service';
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


export class CreateRoleComponent implements OnInit {
  public lang = localStorage.getItem("lang");
  form: FormGroup;
  CreateRole: CreateRoleVM;
  lstRoleCategories: ListRoleCategoriesVM[] = [];
  ModulesWithPermssionsResult:ModulesPermissionsResult;
  errorMessage: string ;
  errorDisplay: boolean = false;
  checked=false;
  dir=this.lang=='en'?'ltr':'rtl';
  isInvalidRoleCategory=true;
  noCheckedAnyPermissions=false;
  lsCheckedModulesWithPermissions:ModuleWithPermissionsVM[];
  SearchSortModule:SortSearchVM;
  ModulesWithPermssions:ModulesWithPermissionsValueVM[]=[]
  count:number;
  constructor(  private spinner:NgxSpinnerService,private ref: DynamicDialogRef,private conf:DynamicDialogConfig,private ModuleService:ModuleService,private ngxService:NgxUiLoaderService,private roleService:RoleService) {
    
  }
  validateRoleCategory()
  {
      this.isInvalidRoleCategory=!this.CreateRole.roleCategoryId;
  }
  ngOnInit(): void {
    this.lstRoleCategories=this.conf.data[0];
    
    this.SearchSortModule={SortFiled:'',SortOrder:1,search:""}
    this.CreateRole={roleCategoryId:null,name:'',displayName:'',ModuleIdsWithPermissions:[]};
    
  }
  LoadModulesWithPermssions(event)
  {
    this.ngxService.start('loading');
    this.SearchSortModule.SortOrder=event.sortOrder;
    this.SearchSortModule.SortFiled=event.sortField;
      this.ModuleService.GetModulesWithPermissions(event.first, event.rows,this.SearchSortModule).subscribe((res) => {
      this.ModulesWithPermssionsResult = res;  
      this.count=this.ModulesWithPermssionsResult.count;
      this.ModulesWithPermssions=this.ModulesWithPermssionsResult.results.map(result=>({...result,permissions:result.permissions.map(p=>({...p,value:false}))}))
      
      this.ngxService.stop('loading');
    },error=>{
      this.ngxService.stop('loading');
    }
    );

  }
  getPermissionValue(ModuleWithPermissions:any,permissionName:string):boolean
  {
    var permissionId=ModuleWithPermissions.permissions.find(p=>p.name==permissionName).id;
    if(this.CreateRole.ModuleIdsWithPermissions.length!=0)
    {
      return this.CreateRole.ModuleIdsWithPermissions.some(m=>m.moduleId==ModuleWithPermissions.id &&m.permissionIDs.some(pId=>pId==permissionId)==true);
     }
    else{
      var per=ModuleWithPermissions.permissions.find(p=>p.name===permissionName)
      if(per)return per.value;
      return false; 
    }
    
  }
  updatePermissionValue(ModuleWithPermissions:ModulesWithPermissionsValueVM,permissionName:string,value:boolean)
  {
    
    var ModuleIdWithpermissionIDs=this.CreateRole.ModuleIdsWithPermissions.find(mwp=>mwp.moduleId==ModuleWithPermissions.id);
    var permissionId=ModuleWithPermissions.permissions.find(p=>p.name==permissionName).id;
    if(ModuleIdWithpermissionIDs)
    {
      if(value)
      {this.CreateRole.ModuleIdsWithPermissions.find(m=>m.moduleId==ModuleWithPermissions.id).permissionIDs.push(permissionId);}
      else{
        var index=this.CreateRole.ModuleIdsWithPermissions.find(m=>m.moduleId==ModuleWithPermissions.id).permissionIDs.indexOf(permissionId);
        if(index!=-1)
        {
          this.CreateRole.ModuleIdsWithPermissions.find(m=>m.moduleId==ModuleWithPermissions.id).permissionIDs.splice(index,1);
          if(this.CreateRole.ModuleIdsWithPermissions.find(m=>m.moduleId==ModuleWithPermissions.id).permissionIDs.length==0)
          {
          this.CreateRole.ModuleIdsWithPermissions=this.CreateRole.ModuleIdsWithPermissions.filter(mwp=>mwp.permissionIDs.length!=0)
        }
      }
    }
  }
    else
    {
      this.CreateRole.ModuleIdsWithPermissions.push({moduleId:ModuleWithPermissions.id,permissionIDs:[permissionId]});

    }
    this.anyPermissionChecked() ?this.noCheckedAnyPermissions=false :this.noCheckedAnyPermissions=true;
  }
  hasPermission(ModuleWithPermssions:any,permission:string)
  {
   
     return ModuleWithPermssions.permissions.some(p=>p.name===permission);
  }
 
  anyPermissionChecked() {
    return this.CreateRole.ModuleIdsWithPermissions.length!=0
}
  addUser() {
    if(this.CreateRole.roleCategoryId == null)
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
    else if(this.CreateRole.name == '')
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
    else if(this.CreateRole.displayName == '')
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
      this.spinner.show()
      this.roleService.AddRole(this.CreateRole).subscribe(res=>{
        this.ref.close(this.CreateRole);
      },
      error=>{
        this.spinner.hide()
        this.errorDisplay = true;
        if (this.lang == 'en') {
          if (error.error.status == 'roleExists') {
            this.errorMessage = error.error.message;
          }
          else if (error.error.status == 'DisplayNameroleExists') {
            this.errorMessage = error.error.message;
          }
      }
      else if (this.lang == 'ar') {
        if (error.error.status == 'roleExists') {
          this.errorMessage = error.error.messageAr;
        }
        else if (error.error.status == 'DisplayNameroleExists') {
          this.errorMessage = error.error.messageAr;
        }
      }
    });
  
}
  
}
