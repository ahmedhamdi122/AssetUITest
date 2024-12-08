import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';
import { ListEmployeeVM, SortEmployeeVM } from 'src/app/Shared/Models/employeeVM';
import { Paging } from 'src/app/Shared/Models/paging';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { EmployeeService } from 'src/app/Shared/Services/employee.service';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { CreateComponent } from '../create/create.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  lang = localStorage.getItem("lang");
  textDir: string = 'ltr';
  currentUser: LoggedUser;
  page: Paging;
  count: number;
  // sortObj: SortEmployeeVM;
  // sortStatus: string = "descending";
  loading: boolean = true;
  lstEmployees: ListEmployeeVM[] = [];
  first = 0;
  rows = 5;
  constructor(private dialogService:DialogService,private authenticationService: AuthenticationService, private employeeService: EmployeeService, private route: Router) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {
    // this.sortObj = {
    //   name: '', nameAr: '', code: '', hospitalName: '', hospitalNameAr: '',
    //   email: '', departmentName: '', departmentNameAr: '', sortStatus: ''
    // }

    // this.page = {
    //   pagenumber: 1,
    //   pagesize: 5,
    // }

    // this.employeeService.GetEmployeesWithPaging(this.page).subscribe(employees => {
    //   this.lstEmployees = employees;
    //   this.loading = false;
    // });

    this.employeeService.GetEmployees().subscribe(employees => {
      this.lstEmployees = employees;
      this.loading = false;
    });

    // this.employeeService.getCount().subscribe((data) => {
    //   this.count = data;
    // });
  }
  // clicktbl(event) {


  //   this.page.pagenumber = (event.first + 10) / 10;
  //   this.page.pagesize = event.rows;

  //   this.employeeService.GetEmployeesWithPaging(this.page).subscribe((items) => {
  //     this.lstEmployees = items;
  //   });

  //   this.employeeService.getCount().subscribe((data) => {
  //     this.count = data;
  //   });
  // }

  addEmployee()
  {
    const dialogRef2 = this.dialogService.open(CreateComponent, {
      header: this.lang == "en" ? 'Add Employee' : "إضافة موظف",
    
      width: '85%',
      style: {
        'dir': this.lang == "en" ? 'ltr' : "rtl",
        "text-align": this.lang == "en" ? 'left' : "right",
        "direction": this.lang == "en" ? 'ltr' : "rtl",
        "font-family": "sans-serif",
        "font-size": 40
      }
    });

    dialogRef2.onClose.subscribe(async (created) => {
     if(created)
     {
      
      // this.sortFilterObjects.searchObj.statusId=1;
      // const lastPageIndex = Math.max(0, Math.floor((this.listRequestStatus[0].count) / 10) * 10);
      // this.reloadTableObj.first=lastPageIndex;
      // await this.LoadRequests(this.reloadTableObj);
      
      // this.dataTable.first=lastPageIndex;
      // this.requestStatusService.GetRequestStatusByUserId(this.currentUser.id).subscribe(res => {
      //   this.listRequestStatus = res.map((status)=>{return {...status,isActive:false}})  
      //   this.listRequestStatus.forEach((s)=>{ s.isActive=false});    
      //   this.listRequestStatus[0].isActive=true;
      }})

  }
  reload() {
    let currentUrl = this.route.url;
    this.route.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.onSameUrlNavigation = 'reload';
    this.route.navigate([currentUrl]);
  }


  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
  }

  isLastPage(): boolean {
    return this.lstEmployees ? this.first === (this.lstEmployees.length - this.rows) : true;
  }

  isFirstPage(): boolean {
    return this.lstEmployees ? this.first === 0 : true;
  }
  // sort(field) {
  //   if (this.sortStatus === "descending") {
  //     this.sortStatus = "ascending";
  //     this.sortObj.sortStatus = this.sortStatus;
  //   }
  //   else {
  //     this.sortStatus = "descending"
  //     this.sortObj.sortStatus = this.sortStatus;
  //   }
  //   if ( field.currentTarget.id == "Code") {
  //     this.sortObj.code =  field.currentTarget.id
  //   }
  //   else if ( field.currentTarget.id == "الكود") {
  //     this.sortObj.code =  field.currentTarget.id
  //   }
  //   if ( field.currentTarget.id == "Name") {
  //     this.sortObj.name =  field.currentTarget.id
  //   }
  //   else if ( field.currentTarget.id == "اسم الأصل") {
  //     this.sortObj.nameAr =  field.currentTarget.id
  //   }
  //   if ( field.currentTarget.id == "Email" ||  field.currentTarget.id == "البريد الإلكتروني") {
  //     this.sortObj.email =  field.currentTarget.id
  //   }
  //   this.employeeService.sortEmplyees(this.page.pagenumber, this.page.pagesize, this.sortObj).subscribe(data => {
  //     this.lstEmployees = data,
  //       this.sortStatus = this.sortObj.sortStatus,
  //       this.sortObj = {
  //         name: '', nameAr: '', code: '', hospitalName: '', hospitalNameAr: '',
  //         email: '', departmentName: '', departmentNameAr: '', sortStatus: ''
  //       }
  //   })
  // }
}
