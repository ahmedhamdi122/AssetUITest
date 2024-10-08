import { DialogConfig } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ModulesPermissionsResult, ModulesWithPermissionsValueVM, ModuleWithPermissionsVM, SearchSortModuleVM } from 'src/app/Shared/Models/Module';
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
  SearchSortModule:SearchSortModuleVM;
  ModulesWithSelectedPermssions:ModulesPermissionsResult;
  RoleId:string;
  count:number;
  searchSortModule:SortSearchVM;
  constructor(private conf:DynamicDialogConfig,private ngxService:NgxUiLoaderService,private RoleService:RoleService)
  {

  }

  ngOnInit(): void {
    this.searchSortModule={Search:"",SortField:"",SortOrder:1}
    this.Role=this.conf.data.roleReqRes;
     this.RoleId=this.conf.data.id;
     
    if (localStorage.getItem("lang") == null) {
      this.lang = 'en'
      this.direction = 'ltr';
    }
    else if (this.lang == 'en') {
      this.direction = 'ltr';
    } else if (this.lang == 'ar') {
      this.direction = 'rtl';
    }
    this.SearchSortModule={SortFiled:'',SortOrder:1,Name:'',NameAr:''}
    console.log("role :",this.Role.categoryName.name);
  }
  LoadModulesWithPermssions(event)
  {
    console.log("event :",event);
    
    this.ngxService.start('loading');
    this.SearchSortModule.SortOrder=event.sortOrder;
    this.SearchSortModule.SortFiled=event.sortField;
      this.RoleService.getModulesPermissionsbyRoleId(this.RoleId,event.first, event.rows,this.searchSortModule).subscribe((res) => {
      this.ModulesWithSelectedPermssions = res;  
      this.count=this.ModulesWithSelectedPermssions.count;
      console.log(this.ModulesWithSelectedPermssions);
      
      this.ngxService.stop('loading');
    },error=>{
      this.ngxService.stop('loading');
    }
    );

  }
}
