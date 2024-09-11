import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EditRoleCategoryVM } from 'src/app/Shared/Models/rolecategoryVM';
import { RoleCategoryService } from 'src/app/Shared/Services/rolecategory.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

  roleCategoryObj: EditRoleCategoryVM;
  constructor( private route: Router, private config: DynamicDialogConfig, private ref: DynamicDialogRef) { }

  ngOnInit(): void {
    this.roleCategoryObj={id:0,name:"",nameAr:"",orderId:0}
    if (this.config.data != null || this.config.data != undefined) {
      this.roleCategoryObj = this.config.data.roleCategoryObj;
    }
  }
  back() { this.ref.close(); }
}
