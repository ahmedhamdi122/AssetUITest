import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { CreateRoleCategoryVM } from 'src/app/Shared/Models/rolecategoryVM';
import { RoleCategoryService } from 'src/app/Shared/Services/rolecategory.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  lang = localStorage.getItem('lang');
  errorDisplay=false;
  errorMessage='';
  frm: FormGroup;
  roleCategoryObj: CreateRoleCategoryVM;
  showError: boolean = false;
  constructor(private roleCategoryService: RoleCategoryService, private route: Router, private ref: DynamicDialogRef) {


    this.roleCategoryService.GenerateRoleCategoryOrderId().subscribe(result => {
      this.roleCategoryObj.orderId = result["orderId"];
    });
  }
  ngOnInit(): void {
    this.roleCategoryObj = { name: '', nameAr: '', orderId: null }
  }
  onSubmit() {
    if(this.roleCategoryObj.orderId==null)
    {
      this.errorDisplay = true;
      if (this.lang == "en") {
        this.errorMessage = "Please Insert order";
      }
      else {
        this.errorMessage = "من فضلك أدخل الترتيب"
      }
      return false;
    }
    if(this.roleCategoryObj.name=='')
      {
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "Please Insert name";
        }
        else {
          this.errorMessage = "من فضلك أدخل الاسم"
        }
        return false;
      }
      if(this.roleCategoryObj.nameAr=='')
        {
          this.errorDisplay = true;
          if (this.lang == "en") {
            this.errorMessage = "Please Insert NameAr";
          }
          else {
            this.errorMessage = "من فضلك أدخل الاسم بالعربي"
          }
          return false;
        }
        console.log("data :",this.roleCategoryObj)
        this.roleCategoryService.AddRoleCategories(this.roleCategoryObj).subscribe(()=>{
          this.ref.close("created");
        }
      ,((error)=>console.log(error)))
  }
  reset() {
    this.roleCategoryObj = { name: '', nameAr: '', orderId: 0 };
  }
}
