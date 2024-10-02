import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ModulesPermissionsResult, ModuleWithPermissionsVM, SearchSortModuleVM } from 'src/app/Shared/Models/Module';
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


export class CreateComponent implements OnInit {
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
  SearchSortModule:SearchSortModuleVM;
  ModulesWithPermssions:ModuleWithPermissionsVM[]=[]
  count:number;
  constructor(  private ref: DynamicDialogRef,private conf:DynamicDialogConfig,private ModuleService:ModuleService,private ngxService:NgxUiLoaderService) {

  }
  validateRoleCategory()
  {
      this.isInvalidRoleCategory=!this.CreateRole.roleCategoryId;
  }
  ngOnInit(): void {
    this.SearchSortModule={SortFiled:'',SortOrder:1,Name:'',NameAr:''}
    this.CreateRole={roleCategoryId:null,name:'',displayName:'',ModuleIdsWithPermissions:[]};
   this.lstRoleCategories=this.conf.data.rolecategoryRes;
  // this.ModuleWithPermssions=this.conf.data.ModuleWithPermissionRes; 
  //this.ModulesWithPermssionsResult=this.conf.data.ModuleWithPermissionRes
  // console.log(" this.ModuleWithPermssions",this.ModulesWithPermssionsResult.Results);
  // this.ModuleWithPermssions=this.conf.data.ModuleWithPermissionRes.map(mwp=>({...mwp,permissions:mwp.permissions.map(p=>({...p,value:false}))}));   
  //  console.log(" this.ModuleWithPermssions",this.ModuleWithPermssions);
  }
  LoadModulesWithPermssions(event)
  {
    this.ngxService.start('loading');
    this.SearchSortModule.SortOrder=event.sortOrder;
    this.SearchSortModule.SortFiled=event.sortField;
      this.ModuleService.GetModulesWithPermissions(event.first, event.rows,this.SearchSortModule).subscribe((res) => {
      this.ModulesWithPermssionsResult = res;  
      this.count=this.ModulesWithPermssionsResult.count;
      this.ModulesWithPermssions=this.ModulesWithPermssionsResult.results;
console.log("count :",this.count);
console.log("ModulesWithPermssions:",this.ModulesWithPermssionsResult.results);
       this.ngxService.stop('loading');
    },error=>{
      this.ngxService.stop('loading');
    }
    );
  }
  getPermissionValue(ModulesWithPermissions:any,permission:string)
  {
    var per=ModulesWithPermissions.permissions.find(p=>p.name===permission)
    if(per)return per.value;
    return false;    
  }
  updatePermissionValue(ModulesWithPermissions:any,permission:string,value:boolean)
  {
    // var per=ModulesWithPermissions.permissions.find(p=>p.name===permission)
    // if(per) per.value=value;
    // this.noCheckedAnyPermissions=!this.anyPermissionChecked();

  }
  hasPermission(rowIndex:number,permission:string)
  {
    // return this.ModuleWithPermssions[rowIndex].permissions.some(p=>p.name===permission);
  }
 
  anyPermissionChecked() {
    // return this.ModuleWithPermssions.some(module => 
    //     module.permissions.some(permission => permission.value === true)
    // );
}
  onSubmit() {
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
    // else if(!this.anyPermissionChecked())
    //   {
    //     this.noCheckedAnyPermissions=true;
    //     this.errorDisplay=true;
    //     if(this.lang=='en'){this.errorMessage='Please select at least one permission'}
    //     else this.errorMessage='من فضلك إضافة صلاحية واحده على الأقل'
    //     return false;
    //   }
  //   this.CreateRole.ModuleIdsWithPermissions = this.ModuleWithPermssionsResult.Results.map(module => ({
  //     moduleId:module.id,
  //     permissionIDs: module.permissions.filter(permission => permission.value === true).map(p=>p.id)
  // })).filter(module => module.permissionIDs.length > 0);
  // console.log("this.CreateRole.ModuleIdsWithPermissions :",this.CreateRole.ModuleIdsWithPermissions);
  
      this.ref.close(this.CreateRole);

}
  
}
