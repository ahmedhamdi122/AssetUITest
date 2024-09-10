import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Paging } from 'src/app/Shared/Models/paging';
import { EditRoleCategoryVM, ListRoleCategoriesVM, SortRoleCategoryVM } from 'src/app/Shared/Models/rolecategoryVM';
import { RoleCategoryService } from 'src/app/Shared/Services/rolecategory.service';
import { DeleteconfirmationComponent } from '../deleteconfirmation/deleteconfirmation.component';
import { CreateComponent } from '../create/create.component';
import { DialogService } from 'primeng/dynamicdialog';
import { EditComponent } from '../edit/edit.component';
import { ViewComponent } from '../view/view.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  public lang = localStorage.getItem("lang");
  page: Paging;
  count: number;
  sortStatus: string = "ascending";
  sortObj: SortRoleCategoryVM;
  loading: boolean = true;
  lstRoleCategories: ListRoleCategoriesVM[] = [];
  selectedObj: EditRoleCategoryVM;
  cols: any[];

  constructor(private rolecategoryService: RoleCategoryService, private dialog: MatDialog, private route: Router, public dialogService: DialogService,private ngxService:NgxUiLoaderService) { }
  ngOnInit(): void {

    this.sortObj = { name: '', nameAr: '', sortStatus: '', id: 0, orderId: 0 }

    this.page = { pagenumber: 1, pagesize: 10 }
    this.ngxService.start();
    this.rolecategoryService.GetRoleCategories().subscribe(items => {
   
      this.lstRoleCategories = items;
      console.log("list :",this.lstRoleCategories)
      this.count=this.lstRoleCategories.length;
      this.loading = false;
      this.ngxService.stop();
    });

 
  }
  deleteRoleCategory(id: number) {
    this.rolecategoryService.GetRoleCategoryById(id).subscribe((data) => {
      this.selectedObj = data;

      const dialogRef2 = this.dialog
        .open(DeleteconfirmationComponent, {
          width: '30%',
          autoFocus: true,
          data: {
            id: this.selectedObj.id,
            name: this.lang == this.selectedObj.name,
            nameAr: this.selectedObj.nameAr,
          },
        });
      dialogRef2.afterClosed().subscribe(() => {
        this.reload();
      })
    });
  }


  addRoleCategory() {
    const dialogRef2 = this.dialogService.open(CreateComponent, {
      header: this.lang == "en" ? 'Add Role Category' : "إضافة  فئة الأدوار",
      width: '50%',
      style: {
        'dir': this.lang == "en" ? 'ltr' : "rtl",
        "text-align": this.lang == "en" ? 'left' : "right",
        "direction": this.lang == "en" ? 'ltr' : "rtl"
      }
    });
    dialogRef2.onClose.subscribe((res) => {
      this.reload();
    });
  }


  editRoleCategory(id: number) {
    const ref = this.dialogService.open(EditComponent, {
      header: this.lang == "en" ? 'Edit Role Category' : "تعديل  فئة الأدوار",
      width: '50%',
      data: {
        id: id
      },
      style: {
        'dir': this.lang == "en" ? 'ltr' : "rtl",
        "text-align": this.lang == "en" ? 'left' : "right",
        "direction": this.lang == "en" ? 'ltr' : "rtl"
      }
    });
    ref.onClose.subscribe((page) => {
      this.reload();
    });
  }


  viewRoleCategory(id: number) {
    const ref = this.dialogService.open(ViewComponent, {
      header: this.lang == "en" ? 'View Role Category' : "بيان  فئة الأدوار",
      width: '50%',
      data: {
        id: id
      },
      style: {
        'dir': this.lang == "en" ? 'ltr' : "rtl",
        "text-align": this.lang == "en" ? 'left' : "right",
        "direction": this.lang == "en" ? 'ltr' : "rtl"
      }
    });
    // ref.onClose.subscribe((page) => {
    //   this.reload();
    // });
  }


  GetRoleCategories(event) {
    this.page.pagenumber = (event.first + 10) / 10;
    this.page.pagesize = event.rows;

    this.rolecategoryService.GetRoleCategories().subscribe(items => {
      this.lstRoleCategories = items;
    });
  }

  reload() {
    let currentUrl = this.route.url;
    this.route.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.onSameUrlNavigation = 'reload';
    this.route.navigate([currentUrl]);
  }
}
