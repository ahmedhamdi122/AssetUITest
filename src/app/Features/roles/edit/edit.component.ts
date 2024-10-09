import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { reportUrl } from 'src/app/constants';
import { ModulePermissionsWithSelectedPermissionIdsVM, ModulesPermissionsWithSelectedPermissionIDsResult, ModulesWithPermissionsValueVM  } from 'src/app/Shared/Models/Module';
import { ListRoleCategoriesVM, SortSearchVM } from 'src/app/Shared/Models/rolecategoryVM';
import { EditRoleVM, RoleVM } from 'src/app/Shared/Models/roleVM';
import { RoleService } from 'src/app/Shared/Services/role.service';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit {
  public lang = localStorage.getItem("lang");
  form: FormGroup;
  EditRole: EditRoleVM;
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
    this.EditRole={id:this.Role.id,roleCategoryId:this.Role.roleCategory.id,name:'',displayName:'',ModuleIdsWithPermissions:[]};
 
    this.SortSearch={SortField:'',SortOrder:1,Search:""}
    
  }
    
  
  LoadModulesWithPermssions(event)
  {    
    console.log("event :",event);
    
    this.spinner.show()
    this.SortSearch.SortOrder=event.sortOrder;
    this.SortSearch.SortField=event.sortField;
      this.roleService.getModulesPermissionsbyRoleIdForEdit(this.Role.id,event.first, event.rows,this.SortSearch).subscribe((res) => {
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
  hasPermission(ModuleWithPermssions:any,permission:string)
  {
   
     return ModuleWithPermssions.permissions.some(p=>p.name===permission);
  }
  getPermissionValue(ModuleWithPermissions:any,permission:string)
  {
    
    var per=ModuleWithPermissions.permissions.find(p=>p.name===permission)
    if(per)return per.value;
    return false;    
  }
  updatePermissionValue(ModuleWithPermissions:ModulesWithPermissionsValueVM,permissionName:string,value:boolean)
  {
    
    var ModuleIdWithpermissionIDs=this.EditRole.ModuleIdsWithPermissions.find(mwp=>mwp.moduleId==ModuleWithPermissions.id);
    var permissionId=ModuleWithPermissions.permissions.find(p=>p.name==permissionName).id;
    if(ModuleIdWithpermissionIDs)
    {
      if(value)
      {this.EditRole.ModuleIdsWithPermissions.find(m=>m.moduleId==ModuleWithPermissions.id).permissionIDs.push(permissionId);}
      else{
        var index=this.EditRole.ModuleIdsWithPermissions.find(m=>m.moduleId==ModuleWithPermissions.id).permissionIDs.indexOf(permissionId);
        if(index!=-1)
        {
          this.EditRole.ModuleIdsWithPermissions.find(m=>m.moduleId==ModuleWithPermissions.id).permissionIDs.splice(index,1);
          if(this.EditRole.ModuleIdsWithPermissions.find(m=>m.moduleId==ModuleWithPermissions.id).permissionIDs.length==0)
          {
          this.EditRole.ModuleIdsWithPermissions=this.EditRole.ModuleIdsWithPermissions.filter(mwp=>mwp.permissionIDs.length!=0)
        }
      }
    }
  }
    else
    {
      this.EditRole.ModuleIdsWithPermissions.push({moduleId:ModuleWithPermissions.id,permissionIDs:[permissionId]});

    }
    this.anyPermissionChecked() ?this.noCheckedAnyPermissions=false :this.noCheckedAnyPermissions=true;
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
    
    console.log("this.EditRole. :",this.EditRole );
    
     // this.ref.close(this.EditRole);

}
  
}
