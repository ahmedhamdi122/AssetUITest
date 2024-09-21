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
  isInvalidRoleCategory=false;
  permissions = [
    { moduleName: 'Master Asset',moduleNameAr:'الأصول الرئيسية', add: false, edit: false, delete: false,viewDetails:false, exportExcel: false, exportPdf: false },
    { moduleName: 'Hospital Asset',moduleNameAr:'أصول المستشفى', add: false, edit: false, delete: false, viewDetails:false,exportExcel: false, exportPdf: false },
    { moduleName: 'Brands', moduleNameAr:'الماركة',add: false, edit: false, delete: false, exportExcel: false,viewDetails:false, exportPdf: false },
    { moduleName: 'Role', moduleNameAr:'الدور',add: false, edit: false, delete: false, exportExcel: false, viewDetails:false,exportPdf: false },
    { moduleName: 'Category Role',moduleNameAr:'فئة الدور', add: false, edit: false, delete: false, exportExcel: false,viewDetails:false, exportPdf: false },
];

  constructor(private roleService: RoleService, private rolecategoryService: RoleCategoryService,private route: Router, private formBuilder: FormBuilder, private ref: DynamicDialogRef,private conf:DynamicDialogConfig) {

    this.roleObj = {name: '', displayName: '',roleCategoryId:0  }
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

   this.lstRoleCategories=this.conf.data.rolecategoryRes;
   this.lstModuleWithPermssions=this.conf.data.ModuleWithPermissionRes;
   console.log("lstModuleWithPermssions :",this.lstModuleWithPermssions);
   

  }
  changeRoleCategoryId($event:any)
  {
    this.roleObj.roleCategoryId = Number($event.target.value);
  }

  anyPermissionChecked(): boolean
  {
    return this.permissions.some(p => 
      p.add || p.delete || p.edit || p.exportExcel || p.exportPdf || p.viewDetails
    );
  }
  onSubmit() {
   
    if(this.roleObj.roleCategoryId == 0)
    {
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
        this.errorDisplay=true;
        if(this.lang=='en'){this.errorMessage='Please select at least one permission'}
        else this.errorMessage='من فضلك إضافة صلاحية واحده على الأقل'
        return false;
      }
      this.ref.close("craeted");
  }

  reset(){  this.roleObj = { name: '',roleCategoryId:0,displayName:'' }}
  
  back(){  this.route.navigate(['/dash/roles']);}
  
}
