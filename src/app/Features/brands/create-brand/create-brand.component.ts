import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CreateBrandVM } from 'src/app/Shared/Models/brandVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { BrandService } from 'src/app/Shared/Services/brand.service';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-create-brand',
  templateUrl: './create-brand.component.html',
  styleUrls: ['./create-brand.component.css']
})
export class CreateBrandComponent implements OnInit {

  lang = localStorage.getItem("lang");
  currentUser: LoggedUser;
  brandObj: CreateBrandVM;
  errorMessage: string;
  errorDisplay: boolean = false;
  savedDisplay: boolean = false;
  constructor(private authenticationService: AuthenticationService, private brandService: BrandService,private spinner:NgxSpinnerService,
    private ref: DynamicDialogRef) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {
    this.brandObj = { id: 0, code: '', name: '', nameAr: '', governorateId: 0 }
  }
  onSubmit() {
    
    if(this.brandObj.code=='')
    {this.errorDisplay = true;
      if (this.lang == "en") {
        this.errorMessage = "Please Insert Code";
      }
      else {
        this.errorMessage = "من فضلك ادخل كود";
      }
      return false;
    }
    if(this.brandObj.name=='')
      {this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "Please Insert Name";
        }
        else {
          this.errorMessage = "من فضلك ادخل اسم";
        }
        return false;
      }
      if(this.brandObj.nameAr=='')
        {this.errorDisplay = true;
          if (this.lang == "en") {
            this.errorMessage = "Please Insert Name in Arabic";
          }
          else {
            this.errorMessage ="من فضلك أدخل الاسم العربي"
          }
          return false;
        }

    this.spinner.show();
    this.brandService.CreateBrand(this.brandObj).subscribe(addedObj => {
      this.brandObj.id = addedObj;
      this.spinner.hide();
      this.ref.close(addedObj);
    },
      (error) => {
        this.spinner.hide();
        this.errorDisplay = true;
        if (this.lang == 'en') {
          if (error.error.status == 'code') {
            this.errorMessage = error.error.message;
            this.brandObj.code="";
          }

          if (error.error.status == 'codelen') {
            this.errorMessage = error.error.message;
            this.brandObj.code="";
          }


          if (error.error.status == 'name') {
            this.errorMessage = error.error.message;
            this.brandObj.name="";
          } if (error.error.status == 'nameAr') {
            this.errorMessage = error.error.message;
            this.brandObj.nameAr="";
          }
        }
        if (this.lang == 'ar') {
          if (error.error.status == 'code') {
            this.errorMessage = error.error.messageAr;
            this.brandObj.code="";
          }

          if (error.error.status == 'codelen') {
            this.errorMessage = error.error.messageAr;
            this.brandObj.code="";
          }
          if (error.error.status == 'name') {
            this.errorMessage = error.error.messageAr;
            this.brandObj.name="";
          }
          if (error.error.status == 'nameAr') {
            this.errorMessage = error.error.messageAr;
            this.brandObj.nameAr="";
          }
        }
        return false;
      });
  }
}
