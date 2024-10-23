import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { ListRoleCategoriesVM, SortSearchVM } from 'src/app/Shared/Models/rolecategoryVM';
import { EditRoleVM, ListRolesVM, RolesResult } from 'src/app/Shared/Models/roleVM';
import { RoleService } from 'src/app/Shared/Services/role.service';
import { RoleCategoryService } from 'src/app/Shared/Services/rolecategory.service';
import { CreateRoleComponent } from '../create/create.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ModuleService } from 'src/app/Shared/Services/module.service';
import { forkJoin } from 'rxjs';
import { Table } from 'primeng/table';
import { EditComponent } from '../edit/edit.component';
import { ViewComponent } from '../view/view.component';
import { ConfirmationService } from 'primeng/api';
import { ModulesPermissionsResult } from 'src/app/Shared/Models/Module';
import { NgxSpinnerService } from 'ngx-spinner';

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
    private rolecategoryService: RoleCategoryService,
    private route: Router ,private dialogService:DialogService,private spinner:NgxSpinnerService,private confirmationService:ConfirmationService
  ) { }
  ngOnInit(): void {
    this.SearchSortRoleObj = { SortField:'', SortOrder: 1 ,Search:''}
  }
  LoadRole(event:any)
  {
    this.spinner.show()
    this.SearchSortRoleObj={ SortField:event.sortField, SortOrder: event.sortOrder ,Search:''};
      this.roleService.GetRoles(event.first, event.rows,this.SearchSortRoleObj).subscribe((items) => {
      this.lstRoles = items.results;           
      this.count = items.count;
      this.spinner.hide()
    },error=>{
      this.errorDisplay=true;
      this.errorMessage="error";
      this.spinner.hide()
    }
    );
  }
  addRole()
  {
    this.spinner.show()
    var rolecategoryReq=this.rolecategoryService.GetRoleCategories();
    forkJoin([rolecategoryReq]).subscribe(
      {
        next:rolecategoryRes=>{
          this.spinner.hide()
          const dialogRef = this.dialogService.open(CreateRoleComponent, {
            header: this.lang == "en" ? 'Add Role ' : "إضافة دور",
            width: '70%',
            data:rolecategoryRes,
            style: {
              'dir': this.lang == "en" ? 'ltr' : "rtl",
              "text-align": this.lang == "en" ? 'left' : "right",
              "direction": this.lang == "en" ? 'ltr' : "rtl"
            }
          });
              dialogRef.onClose.subscribe((CreateRole) => {
            if(CreateRole)
            {
 
                this.reloadTableObj.first=Math.max(0, Math.floor((this.count) / 10) * 10);;
                this.LoadRole(this.reloadTableObj);
                this.dataTable.first=this.count;
                this.displaySuccessCreate=true;
              }
      
          
        })
      },error:err=>{

        }})

  }
  viewRole(id:string)
  {
    this.spinner.show()
    var roleReq=this.roleService.GetRoleById(id);
    forkJoin([roleReq]).subscribe(
      {
        next:([roleRes])=>{
          this.spinner.hide()
          const dialogRef = this.dialogService.open(ViewComponent, {
            header: this.lang == "en" ? 'View Role ' : "عرض دور",
            width: '70%',
            data:{"roleRes":roleRes},
            style: {
              'dir': this.lang == "en" ? 'ltr' : "rtl",
              "text-align": this.lang == "en" ? 'left' : "right",
              "direction": this.lang == "en" ? 'ltr' : "rtl"
            }
          });
        },
        error:(err)=>{
          
        }
      }
    ) 
     }
  deleteRole(item:any,rowIndex:number)
  {
      this.selectedObj = item;
      this.confirmationService.confirm({
        message: `${this.lang === 'en' ? `Are you sure that you want to delete ${this.selectedObj.name}?` : `هل أنت متأكد أنك تريد حذف ${this.selectedObj.name}؟`}`,
        header: `${this.lang === 'en' ? 'Delete Confirmation' : 'تأكيد المسح'}`,
        icon: 'pi pi-exclamation-triangle',
        acceptIcon: 'none', 
        rejectIcon: 'none', 
        acceptButtonStyleClass: 'btn btn-primary m-2', 
        rejectButtonStyleClass: 'btn btn-light m-2',
        rejectLabel: this.lang === 'en' ? 'No' : 'لا',
        acceptLabel: this.lang === 'en' ? 'Yes' : 'نعم',
        accept: () => {
          
          this.spinner.show()
          this.roleService.DeleteRole(item.id).subscribe(
            deleted => {
              this.spinner.hide()
              this.displaySuccessDelete=true;
              const first = (Math.floor(rowIndex / 10))*10;
              this.reloadTableObj.first=first;
              this.LoadRole(this.reloadTableObj)
              this.dataTable.first=first;
            },
            error => {
              
              this.spinner.hide()
              this.errorDisplay=true;
              if (this.lang == 'en') {
                if (error.error.status == 'IsRoleAssignedToUsers') {
                  this.errorMessage = error.error.message;
                }
                else {
                  this.errorMessage = 'An unexpected error occurred. Please try again later.'
                }
               
            }
            else if (this.lang == 'ar') {
              if (error.error.status == 'IsRoleAssignedToUsers') {
                this.errorMessage = error.error.messageAr;
              }
              else {
                this.errorMessage =  'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى لاحقًا.';
              }
           
            }
      
            }
          );
        },
        reject: () => {
        }
      });

   }
   editRole(id:string)
   {
    this.spinner.show()
    var roleReq=this.roleService.GetRoleById(id);
    var rolecategoryReq=this.rolecategoryService.GetRoleCategories();
    forkJoin([roleReq,rolecategoryReq]).subscribe(
      {
        next:([roleRes,rolecategoryRes])=>{
          this.spinner.hide()
          const dialogRef = this.dialogService.open(EditComponent, {
            header: this.lang == "en" ? 'Edit Role ' : "تعديل دور",
            width: '70%',
            data:{"roleReqRes":roleRes,"rolecategoryRes":rolecategoryRes},
            style: {
              'dir': this.lang == "en" ? 'ltr' : "rtl",
              "text-align": this.lang == "en" ? 'left' : "right",
              "direction": this.lang == "en" ? 'ltr' : "rtl"
            }
          });
              dialogRef.onClose.subscribe((editRole) => {
            if(editRole)
            {
            }
          });
          
        },
        error:(err)=>{}
      }
    )
  
  }
  reload() {
    let currentUrl = this.route.url;
    this.route.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.onSameUrlNavigation = 'reload';
    this.route.navigate([currentUrl]);
  }


}
