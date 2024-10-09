import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { reportUrl } from 'src/app/constants';
import { ModulePermissionsWithSelectedPermissionIdsVM, ModulesPermissionsWithSelectedPermissionIDsResult, ModulesWithPermissionsValueVM  } from 'src/app/Shared/Models/Module';
import { ListRoleCategoriesVM, SortSearchVM } from 'src/app/Shared/Models/rolecategoryVM';
import { CreateRoleVM, RoleVM } from 'src/app/Shared/Models/roleVM';
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
  ModulesPermissionsResult:ModulesPermissionsWithSelectedPermissionIDsResult;
  errorMessage: string ;
  errorDisplay: boolean = false;
  checked=false;
  dir=this.lang=='en'?'ltr':'rtl';
  isInvalidRoleCategory=false;
  noCheckedAnyPermissions=false;
  SortSearch:SortSearchVM;
  Role:RoleVM;
  RoleId:string;
  count:number;
  ModuleWithPermissions:ModulesWithPermissionsValueVM[];
  // lsCheckedModulesWithPermissions:ModulesWithPermissionsVM[];
  constructor( private ref: DynamicDialogRef,private conf:DynamicDialogConfig,private spinner:NgxSpinnerService,private roleService:RoleService) {
  }
  validateRoleCategory()
  {
      this.isInvalidRoleCategory=!this.EditRole.roleCategoryId;
  }
  ngOnInit(): void {
    this.Role=this.conf.data.roleReqRes;
    this.lstRoleCategories=this.conf.data.rolecategoryRes;
    //this.EditRole.roleCategoryId=this.Role.roleCategory.id;
    this.EditRole={roleCategoryId:this.Role.roleCategory.id,name:'',displayName:'',ModuleIdsWithPermissions:[]};
 
    this.SortSearch={SortField:'',SortOrder:1,Search:""}
    
  }
    
  
  LoadModulesWithPermssions(event)
  {    
    console.log("event :",event);
    
    this.spinner.show()
    this.SortSearch.SortOrder=event.sortOrder;
    this.SortSearch.SortField=event.sortField;
      this.roleService.getModulesPermissionsbyRoleIdForEdit(this.Role.id,event.first, event.rows,this.SortSearch).subscribe((res) => {
        console.log("res :",res);
      this.ModulesPermissionsResult = res;  
       this.count=this.ModulesPermissionsResult.count;
       this.ModuleWithPermissions=this.ModulesPermissionsResult.results.map(result=>({...result,permissions:result.permissions.map(p=>{if(result.selectedPemrissionIDs.some(spID=>p.id==spID)==true)return {...p,value:true};else return {...p,value:false};})}));
       console.log("this.ModuleWithPermissions :",this.ModuleWithPermissions)
     this.spinner.hide();
    },error=>{
     this.spinner.hide();
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
    var per=ModulesWithPermissions.permissions.find(p=>p.name===permission)
    if(per) per.value=value;
    this.noCheckedAnyPermissions=!this.anyPermissionChecked();

  }
  anyPermissionChecked() {
    return this.EditRole.ModuleIdsWithPermissions.length!=0
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
  //   this.EditRole.ModuleIdsWithPermissions = this.ModulesWithPermssions.map(module => ({
  //     moduleId:module.id,
  //     permissionIDs: module.permissions.filter(permission => permission.value === true).map(p=>p.id)
  // })).filter(module => module.permissionIDs.length > 0);
  // console.log("this.EditRole.ModuleIdsWithPermissions :",this.EditRole.ModuleIdsWithPermissions);
  
      this.ref.close(this.EditRole);

}
  
}
