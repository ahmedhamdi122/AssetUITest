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
import { Table } from 'primeng/table';
import { EditComponent } from '../edit/edit.component';
import { ViewComponent } from '../view/view.component';
import { ConfirmationService } from 'primeng/api';
import { ModulesPermissionsResult, SearchSortModuleVM } from 'src/app/Shared/Models/Module';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  @ViewChild("table") dataTable:Table;
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
  ModulesPermissionsResult:ModulesPermissionsResult
  reloadTableObj={"sortOrder":1,"sortField":null,"first":0,"rows":10};
  constructor(
    private roleService: RoleService,
    private rolecategoryService: RoleCategoryService,private ModuleService:ModuleService,private confirmationService:ConfirmationService,
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
    forkJoin([rolecategoryReq]).subscribe(
      {
        next:([rolecategoryRes])=>{
          this.ngxService.stop();
          const dialogRef = this.dialogService.open(CreateComponent, {
            header: this.lang == "en" ? 'Add Role ' : "إضافة دور",
            width: '70%',
            data:{"rolecategoryRes":rolecategoryRes},
            style: {
              'dir': this.lang == "en" ? 'ltr' : "rtl",
              "text-align": this.lang == "en" ? 'left' : "right",
              "direction": this.lang == "en" ? 'ltr' : "rtl"
            }
          });
              dialogRef.onClose.subscribe((CreateRole) => {
            if(CreateRole)
            {
              this.ngxService.start();
              console.log("crearee obj :",CreateRole);
              
              this.roleService.AddRole(CreateRole).subscribe(res=>{
                this.ngxService.stop();
                this.reloadTableObj.first=Math.max(0, Math.floor((this.count) / 10) * 10);;
                this.LoadRole(this.reloadTableObj);
                this.dataTable.first=this.count;
                this.displaySuccessCreate=true;
              })
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

    // this.ngxService.start()
    // var rolecategoryReq=this.rolecategoryService.GetRoleCategories();
    // var ModuleWithPermissionReq=this.ModuleService.GetModulesWithPermissions();
    // forkJoin([rolecategoryReq,ModuleWithPermissionReq]).subscribe(
    //   {
    //     next:([rolecategoryRes,ModuleWithPermissionRes])=>{
    //       this.ngxService.stop();
    //       const dialogRef = this.dialogService.open(ViewComponent, {
    //         header: this.lang == "en" ? 'View Role ' : "عرض دور",
    //         width: '70%',
    //         data:{"rolecategoryRes":rolecategoryRes,"ModuleWithPermissionRes":ModuleWithPermissionRes},
    //         style: {
    //           'dir': this.lang == "en" ? 'ltr' : "rtl",
    //           "text-align": this.lang == "en" ? 'left' : "right",
    //           "direction": this.lang == "en" ? 'ltr' : "rtl"
    //         }
    //       });
    //     },
    //     error:(err)=>{
    //       console.log("some error  : ",err);
          
    //     }
    //   }
    // ) 
     }
  deleteRole(item:any,rowIndex:number)
  {
      //check in backEnd before delete role that is exists first 
      //and no user have this role 
  //     this.selectedObj = item;
  //     this.confirmationService.confirm({
  //       message: `${this.lang === 'en' ? `Are you sure that you want to delete ${this.selectedObj.name}?` : `هل أنت متأكد أنك تريد حذف ${this.selectedObj.name}؟`}`,
  //       header: `${this.lang === 'en' ? 'Delete Confirmation' : 'تأكيد المسح'}`,
  //       icon: 'pi pi-exclamation-triangle',
  //       acceptIcon: 'none', 
  //       rejectIcon: 'none', 
  //       acceptButtonStyleClass: 'btn btn-primary m-2', 
  //       rejectButtonStyleClass: 'btn btn-light m-2',
  //       rejectLabel: this.lang === 'en' ? 'No' : 'لا',
  //       acceptLabel: this.lang === 'en' ? 'Yes' : 'نعم',
  //       accept: () => {
  //         this.ngxService.start();
  //         this.rolecategoryService.DeleteRoleCategory(item.id).subscribe(
  //           deleted => {
  //             this.ngxService.stop();
  //             this.displaySuccessDelete=true;
  //             const first = (Math.floor(rowIndex / 10))*10;
  //             this.reloadTableObj.first=first;
  //             this.LoadRole(this.LoadRole)
  //             this.dataTable.first=first;
  //           },
  //           error => {
  //             this.ngxService.stop();
  //             console.error('Error deleting Role Category:', error);
  //             this.errorDisplay=true;
  //             this.errorMessage=`${this.lang == 'en'?`${error.error.message}`:`${error.error.messageAr}`}`;
  //           }
  //         );
  //       },
  //       reject: () => {
  //         console.log('Deletion rejected.');
  //       }
  //     });

  // }
  // editRole(item:any,rowIndex:number)
  // {
  //   this.ngxService.start()
  //   var rolecategoryReq=this.rolecategoryService.GetRoleCategories();
  //   var ModuleWithPermissionReq=this.ModuleService.GetModulesWithPermissions();
  //   forkJoin([rolecategoryReq,ModuleWithPermissionReq]).subscribe(
  //     {
  //       next:([rolecategoryRes,ModuleWithPermissionRes])=>{
  //         this.ngxService.stop();
  //         const dialogRef = this.dialogService.open(EditComponent, {
  //           header: this.lang == "en" ? 'Add Role ' : "إضافة دور",
  //           width: '70%',
  //           data:{"rolecategoryRes":rolecategoryRes,"ModuleWithPermissionRes":ModuleWithPermissionRes},
  //           style: {
  //             'dir': this.lang == "en" ? 'ltr' : "rtl",
  //             "text-align": this.lang == "en" ? 'left' : "right",
  //             "direction": this.lang == "en" ? 'ltr' : "rtl"
  //           }
  //         });
  //             dialogRef.onClose.subscribe((editRole) => {
  //           if(editRole)
  //           {
  //            console.log("edit");
             
  //           }
  //         });
          
  //       },
  //       error:(err)=>{
  //         console.log("some error  : ",err);
          
  //       }
  //     }
  //   )
  }
  reload() {
    let currentUrl = this.route.url;
    this.route.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.onSameUrlNavigation = 'reload';
    this.route.navigate([currentUrl]);
  }


}
