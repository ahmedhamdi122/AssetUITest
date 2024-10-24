import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';
import { Paging } from 'src/app/Shared/Models/paging';
import { ListRoleCategoriesVM } from 'src/app/Shared/Models/rolecategoryVM';
import { EditUserVM, ListUsersVM, LoggedUser, SortUsersVM, UserResultVM, UserVM } from 'src/app/Shared/Models/userVM';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { RoleCategoryService } from 'src/app/Shared/Services/rolecategory.service';
import { UserService } from 'src/app/Shared/Services/user.service';
import { CreateComponent } from '../create/create.component';
import { SectionModulePermisisons, SortSearchVM } from 'src/app/Shared/Models/Module';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  lang = localStorage.getItem("lang");
  currentUser: LoggedUser;
  loading: boolean;
  page: Paging;
  count: number;
  UserResult: UserResultVM;
  users:UserVM[];
  selectedObj: EditUserVM;
  lstRoleCategories: ListRoleCategoriesVM[] = [];
  sortStatus: string = "descending";
  sortObj: SortSearchVM;
  displaySuccessDelete:string;
  displaySuccessCreate:boolean;
  errorMessage:string;
  errorDisplay:string;
  reloadTableObj={"sortOrder":1,"sortField":null,"first":0,"rows":10};
  SectionModulePermisisons:SectionModulePermisisons[];
  constructor(
     private spinner:NgxSpinnerService,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private route: Router, private dialogService: DialogService
  ) { this.currentUser = this.authenticationService.currentUserValue; }
  ngOnInit(): void {
    this.page = {
      pagenumber: 1,
      pagesize: 10
    }

    this.authenticationService.AllModulesPermissionsForCurrentUser$.subscribe(
      res=>
        {
          this.SectionModulePermisisons=res
          
        }
    )
  }
  LoadUsers(event) {
    this.sortObj = { SortFiled: event.sortField, SortOrder: event.sortOrder ,search:''}
    this.spinner.show()
    this.userService.GetUsers(event.first,event.rows, this.sortObj).subscribe((res) => {
      this.UserResult = res;
      this.users=this.UserResult.results;
      this.count=this.UserResult.count;
      this.spinner.hide();

    });
  }
  addUser()
  {
    
    const dialogRef2 = this.dialogService.open(CreateComponent, {
      header: this.lang == "en" ? 'Add User' : " إضافة مستخدم",
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
        //  const lastPageIndex = Math.max(0, Math.floor((this.count) / 10) * 10);
        // this.reloadTableObj.first=lastPageIndex;
        // this.LoadUsers(this.reloadTableObj);
        // this.dataTable.first=this.count;
      }
    });
  }
  deleteUser(id: string) {
   


    // this.userService.GetUserById(id).subscribe((data) => {
    //   this.selectedObj = data;

    //   const dialogRef2 = this.dialog.open(DeleteconfirmationComponent, {
    //     width: '30%', 
    //     autoFocus: true,
    //     data: {
    //       id: this.selectedObj.id,
    //       name: this.selectedObj.userName,
    //     },
    //   });

    //   dialogRef2.afterClosed().subscribe(deleted => {
    //     this.reload();
    //   });
    // });


  }

  reload() {
    let currentUrl = this.route.url;
    this.route.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.onSameUrlNavigation = 'reload';
    this.route.navigate([currentUrl]);
  }

}
