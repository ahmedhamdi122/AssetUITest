import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { ListRoleCategoriesVM } from 'src/app/Shared/Models/rolecategoryVM';
import { EditRoleVM, ListRolesVM } from 'src/app/Shared/Models/roleVM';
import { RoleService } from 'src/app/Shared/Services/role.service';
import { RoleCategoryService } from 'src/app/Shared/Services/rolecategory.service';
import { CreateComponent } from '../create/create.component';

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
  displaySuccessDelete=false;
  displaySuccessCreate=false;
  count=0;
  constructor(
    private roleService: RoleService,
    private rolecategoryService: RoleCategoryService,
    private route: Router ,private dialogService:DialogService
  ) { }
  ngOnInit(): void {
    this.roleService.GetRoles().subscribe((items) => {
      this.lstRoles = items;
      this.loading = false;
      console.log("data :",this.lstRoles);
    });


    this.rolecategoryService.GetRoleCategories().subscribe((items) => {
      this.lstRoleCategories = items;
    });
  }

  LoadRole(event:any)
  {

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
