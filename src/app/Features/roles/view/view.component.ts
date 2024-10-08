import { DialogConfig } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { SearchSortModuleVM } from 'src/app/Shared/Models/Module';
import { EditRoleVM, RoleVM } from 'src/app/Shared/Models/roleVM';

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
  ModulesWithSelectedPermssions:any;
  constructor(private conf:DynamicDialogConfig)
  {

  }

  ngOnInit(): void {
    this.Role=this.conf.data;
     
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

}
