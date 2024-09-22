import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { ListRoleCategoriesVM, SortSearchVM } from 'src/app/Shared/Models/rolecategoryVM';
import { EditRoleVM, ListRolesVM, RolesResult } from 'src/app/Shared/Models/roleVM';
import { RoleService } from 'src/app/Shared/Services/role.service';
import { RoleCategoryService } from 'src/app/Shared/Services/rolecategory.service';
import { CreateComponent } from '../create/create.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ModuleService } from 'src/app/Shared/Services/module.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  lang = localStorage.getItem("lang");
  loading: boolean = true;
  first = 0;
  rows = 5;
  lstRoles: ListRolesVM[] = [];
  selectedObj: EditRoleVM;
  lstRoleCategories: ListRoleCategoriesVM[];
  RolesResult:RolesResult;
  displaySuccessDelete=false;
  displaySuccessCreate=false;
  count=0;
  SearchSortRoleObj:SortSearchVM;
  errorDisplay=false;
  errorMessage='';
  constructor(
    private roleService: RoleService,
    private rolecategoryService: RoleCategoryService,private ModuleService:ModuleService,
    private route: Router ,private dialogService:DialogService,private ngxService:NgxUiLoaderService
  ) { }
  ngOnInit(): void {
    this.SearchSortRoleObj = { SortField:'', SortOrder: 1 ,search:''}
  }
  LoadRole(event:any)
  {
    this.ngxService.start();
    this.SearchSortRoleObj={ SortField:event.sortField, SortOrder: event.sortOrder ,search:''};
      this.roleService.GetRoles(event.first, event.rows,this.SearchSortRoleObj).subscribe((items) => {
      this.lstRoles = items.results;           
      this.count = items.count;
       this.ngxService.stop();
    },error=>{
      this.errorDisplay=true;
      this.errorMessage="error when delete";
      this.ngxService.stop();
    }
    );
  }
  addRole()
  {
    this.ngxService.start()
    var rolecategoryReq=this.rolecategoryService.GetRoleCategories();
    var ModuleWithPermissionReq=this.ModuleService.GetModulesWithPermissions();
    forkJoin([rolecategoryReq,ModuleWithPermissionReq]).subscribe(
      {
        next:([rolecategoryRes,ModuleWithPermissionRes])=>{
          this.ngxService.stop();
          const dialogRef = this.dialogService.open(CreateComponent, {
            header: this.lang == "en" ? 'Add Role ' : "إضافة دور",
            width: '70%',
            data:{"rolecategoryRes":rolecategoryRes,"ModuleWithPermissionRes":ModuleWithPermissionRes},
            style: {
              'dir': this.lang == "en" ? 'ltr' : "rtl",
              "text-align": this.lang == "en" ? 'left' : "right",
              "direction": this.lang == "en" ? 'ltr' : "rtl"
            }
          });
              dialogRef.onClose.subscribe((created) => {
            if(created)
            {
               this.displaySuccessCreate=true;
    
            }
          });
          
        },
        error:(err)=>{
          console.log("some error  : ",err);
          
        }
      }
    )
     




  }
  viewRole(id:number)
  {

  }
  deleteRole(item:any,rowIndex:number)
  {
      //check in backEnd before delete role that is exists first 
      //and no user have this role 


  }
  editRole(item:any,rowIndex:number)
  {

  }
  reload() {
    let currentUrl = this.route.url;
    this.route.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.onSameUrlNavigation = 'reload';
    this.route.navigate([currentUrl]);
  }


}
