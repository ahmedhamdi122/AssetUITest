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
    private rolecategoryService: RoleCategoryService,
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
    const dialogRef2 = this.dialogService.open(CreateComponent, {
      header: this.lang == "en" ? 'Add Role ' : "إضافة دور",
      width: '70%',
      style: {
        'dir': this.lang == "en" ? 'ltr' : "rtl",
        "text-align": this.lang == "en" ? 'left' : "right",
        "direction": this.lang == "en" ? 'ltr' : "rtl"
      }
    });
    // dialogRef2.onClose.subscribe((created) => {
    //   if(created)
    //   {
    //     this.displaySuccessCreate=true;
    //      const lastPageIndex = Math.max(0, Math.floor((this.count) / 10) * 10);
    //     this.reloadTableObj.first=lastPageIndex;
    //     this.LoadRoleCategories(this.reloadTableObj);
    //     this.dataTable.first=this.count;
    //   }
    // });
  }
  viewRole(id:number)
  {

  }
  deleteRole(item:any,rowIndex:number)
  {

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
