import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EditRoleCategoryVM } from 'src/app/Shared/Models/rolecategoryVM';
import { RoleCategoryService } from 'src/app/Shared/Services/rolecategory.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  lang = localStorage.getItem('lang');
  errorMessage='';
  errorDisplay=false;
  frm: FormGroup;
  roleCategoryObj: EditRoleCategoryVM;
  selectedlang: string = '';
  constructor(private roleCategoryService: RoleCategoryService, private formBuilder: FormBuilder, private config: DynamicDialogConfig, private ref: DynamicDialogRef) {
  }

  ngOnInit(): void {

  

    if (this.config.data != null || this.config.data != undefined) {
      this.roleCategoryObj = this.config.data.roleCategoryObj;
  }
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
      this.roleCategoryService.UpdateRoleCategory(this.roleCategoryObj).subscribe(() => {

        this.ref.close("updated");
      });
    
  }

  reset() {
    this.roleCategoryObj = { name: '', nameAr: '', id: 0, orderId: 0 }
  }

}
