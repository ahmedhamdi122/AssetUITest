import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Paging } from 'src/app/Shared/Models/paging';
import { EditRoleCategoryVM, ListRoleCategoriesVM, RoleCategoriesResult, SortSearchVM } from 'src/app/Shared/Models/rolecategoryVM';
import { RoleCategoryService } from 'src/app/Shared/Services/rolecategory.service';
import { CreateComponent } from '../create/create.component';
import { DialogService } from 'primeng/dynamicdialog';
import { EditComponent } from '../edit/edit.component';
import { ViewComponent } from '../view/view.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Table } from 'primeng/table';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  public lang = localStorage.getItem("lang");
  page: Paging;
  count: number;
  sortObj: SortSearchVM;
  loading: boolean = true;
  lstRoleCategories:ListRoleCategoriesVM[];
  RoleCategoriesResult: RoleCategoriesResult;
  selectedObj: EditRoleCategoryVM;
  cols: any[];
  roleCategoryObj: EditRoleCategoryVM;
  errorDisplay=false;
  errorMessage='';
  displaySuccessCreate=false;
  displaySuccessDelete=false;
  @ViewChild('table') dataTable: Table;
  reloadTableObj={"sortOrder":1,"sortField":null,"first":0,"rows":10};
  constructor(private rolecategoryService: RoleCategoryService, private dialog: MatDialog, private route: Router, public dialogService: DialogService,private ngxService:NgxUiLoaderService,private confirmationService:ConfirmationService) { }
  ngOnInit(): void {
  }

  deleteRoleCategory(item: any,rowIndex:any) {
      this.selectedObj = item;
      this.confirmationService.confirm({
        message: `${this.lang === 'en' ? `Are you sure that you want to delete ${this.selectedObj.name}?` : `هل أنت متأكد أنك تريد حذف ${this.selectedObj.nameAr}؟`}`,
        header: `${this.lang === 'en' ? 'Delete Confirmation' : 'تأكيد المسح'}`,
        icon: 'pi pi-exclamation-triangle',
        acceptIcon: 'none', 
        rejectIcon: 'none', 
        acceptButtonStyleClass: 'btn btn-primary m-2', 
        rejectButtonStyleClass: 'btn btn-light m-2',
        rejectLabel: this.lang === 'en' ? 'No' : 'لا',
        acceptLabel: this.lang === 'en' ? 'Yes' : 'نعم',
        accept: () => {
          this.ngxService.start();
          this.rolecategoryService.DeleteRoleCategory(item.id).subscribe(
            deleted => {
              this.ngxService.stop();
              this.displaySuccessDelete=true;
              const first = (Math.floor(rowIndex / 10))*10;
              this.reloadTableObj.first=first;
              this.LoadRoleCategories( this.reloadTableObj);
              this.dataTable.first=first;
            },
            error => {
              this.ngxService.stop();
              console.error('Error deleting Role Category:', error);
              this.errorDisplay=true;
              this.errorMessage=`${this.lang == 'en'?`${error.error.message}`:`${error.error.messageAr}`}`;
            }
          );
        },
        reject: () => {
          console.log('Deletion rejected.');
        }
      });

    
  }


  addRoleCategory() {
    const dialogRef2 = this.dialogService.open(CreateComponent, {
      header: this.lang == "en" ? 'Add Role Category' : "إضافة  فئة الأدوار",
      width: '70%',
      style: {
        'dir': this.lang == "en" ? 'ltr' : "rtl",
        "text-align": this.lang == "en" ? 'left' : "right",
        "direction": this.lang == "en" ? 'ltr' : "rtl"
      }
    });
    dialogRef2.onClose.subscribe((created) => {
      if(created)
      {
        this.displaySuccessCreate=true;
         const lastPageIndex = Math.max(0, Math.floor((this.count) / 10) * 10);
        this.reloadTableObj.first=lastPageIndex;
        this.LoadRoleCategories(this.reloadTableObj);
        this.dataTable.first=this.count;
      }
    });
  }
  editRoleCategory(id: number,rowIndex) {


    this.rolecategoryService.GetRoleCategoryById(id).subscribe(
      (data => {
        this.roleCategoryObj = data;
        this.ngxService.stop()
        const ref = this.dialogService.open(EditComponent, {
          header: this.lang == "en" ? 'Edit Role Category' : "تعديل  فئة الأدوار",
          width: '50%',
          data: {
            roleCategoryObj:  this.roleCategoryObj 
          },
          style: {
            'dir': this.lang == "en" ? 'ltr' : "rtl",
            "text-align": this.lang == "en" ? 'left' : "right",
            "direction": this.lang == "en" ? 'ltr' : "rtl"
          }
        });
        ref.onClose.subscribe((updated) => {
          if(updated)
          {
            var first=Math.floor(rowIndex/10)*10;
           this.reloadTableObj.first=first;
           this.LoadRoleCategories(this.reloadTableObj);
           this.dataTable.first=first;
          }
        });
      }), (error => {console.log(error); this.ngxService.stop()}));
  }
  viewRoleCategory(id: number) {
    this.ngxService.start();
    this.rolecategoryService.GetRoleCategoryById(id).subscribe(
      (data => {
        this.roleCategoryObj = data;
        this.ngxService.stop();
        const ref = this.dialogService.open(ViewComponent, {
          header: this.lang == "en" ? 'View Role Category' : "بيان  فئة الأدوار",
          width: '50%',
          data: {
            roleCategoryObj: this.roleCategoryObj
          },
          style: {
            'dir': this.lang == "en" ? 'ltr' : "rtl",
            "text-align": this.lang == "en" ? 'left' : "right",
            "direction": this.lang == "en" ? 'ltr' : "rtl"
          }
        });
      }), (error =>{ console.log(error);     
         this.ngxService.stop()}
    ));
    
  }


  LoadRoleCategories(event) {    
    this.ngxService.start();
    this.sortObj = { SortField: event.sortField, SortOrder: event.sortOrder ,search:''}
    this.rolecategoryService.LoadRoleCategories(event.first,event.rows, this.sortObj).subscribe(items => {
      this.RoleCategoriesResult = items;
     this.lstRoleCategories=this.RoleCategoriesResult.results;
      this.count=this.RoleCategoriesResult.count;
      this.ngxService.stop();
    });
  }
  reload() {
    let currentUrl = this.route.url;
    this.route.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.onSameUrlNavigation = 'reload';
    this.route.navigate([currentUrl]);
  }
}

