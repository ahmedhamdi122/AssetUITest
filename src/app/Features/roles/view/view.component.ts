import { DialogConfig } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ModulesPermissionsResult, ModulesWithPermissionsValueVM } from 'src/app/Shared/Models/Module';
import { SortSearchVM } from 'src/app/Shared/Models/rolecategoryVM';
import { EditRoleVM, RoleVM } from 'src/app/Shared/Models/roleVM';
import { RoleService } from 'src/app/Shared/Services/role.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrl: './view.component.css'
})
export class ViewComponent implements OnInit{
  Role:RoleVM;
  lang = localStorage.getItem("lang");
  direction:string;
  SortSearch:SortSearchVM;
  ModulesPermissionsResult:ModulesPermissionsResult;
  ModuleWithPermissions:ModulesWithPermissionsValueVM[]
  RoleId:string;
  count:number;
  constructor(private conf:DynamicDialogConfig,private spinner:NgxSpinnerService,private RoleService:RoleService)
  {

  }

  ngOnInit(): void {
    this.SortSearch={Search:"",SortField:"",SortOrder:1}
    this.Role=this.conf.data.roleRes;
    
    if (localStorage.getItem("lang") == null) {
      this.lang = 'en'
      this.direction = 'ltr';
    }
    else if (this.lang == 'en') {
      this.direction = 'ltr';
    } else if (this.lang == 'ar') {
      this.direction = 'rtl';
    }
    this.SortSearch={SortField:'',SortOrder:1,Search:""}
  }
  LoadModulesWithPermssions(event)
  {    
    
    this.spinner.show()
    this.SortSearch.SortOrder=event.sortOrder;
    this.SortSearch.SortField=event.sortField;
      this.RoleService.getModulesPermissionsbyRoleId(this.Role.id,event.first, event.rows,this.SortSearch).subscribe((res) => {
      this.ModulesPermissionsResult = res;  
      this.count=this.ModulesPermissionsResult.count;
      this.ModuleWithPermissions=this.ModulesPermissionsResult.results.map(result=>({...result,permissions:result.permissions.map(p=>({...p,value:true}))}));
      
     this.spinner.hide();
    },error=>{
     this.spinner.hide();
    }
    );
  }
  getPermissionValue(ModuleWithPermissions:any,permissionName:string):boolean
  {
    var per=ModuleWithPermissions.permissions.find(p=>p.name===permissionName)
    if(per)return per.value;
    return false; 
  }
}
