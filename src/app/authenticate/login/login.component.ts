import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../Shared/Services/guards/authentication.service';
import { AuthGuard } from '../../Shared/Services/guards/authGuard.guard';
import { LoggedUser, User } from '../../Shared/Models/userVM';
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Component({
  selector: 'app-login',
  templateUrl:
   './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loggingUserObj: User;
  userObj: LoggedUser;
  userCookieObj: LoggedUser;
  display: boolean = false;
  displayerror: string = "";
  errorDisplay=false;
  errorMessage:string='';
  lang = localStorage.getItem("lang");
  textDir: string = 'ltr';
  cookieValue: string = "";
  constructor(private router: Router, private authenticationService: AuthenticationService,private ngxService:NgxUiLoaderService,
   private activateRoute: ActivatedRoute, private Authguardservice: AuthGuard) {
  }
  ngOnInit(): void {
    this.loggingUserObj = { userName: '', passwordHash: '', isRemembered: false }
    this.userObj = {
      hospitalTypeNum: 0, email: '', userNameAr: '', strInsitute: '', strInsituteAr: '', strLogo: '', isAgency: false, isScrap: false, isVisit: false, isExternalFix: false, isOpenRequest: false,
      id: '', userName: '', roleName: '', roleNames: [], displayName: '', token: '', isRemembered: false, hospitalCode: '', canAdd: false,
      governorateId: 0, cityId: 0, organizationId: 0, subOrganizationId: 0, hospitalId: 0, supplierId: 0, commetieeMemberId: 0,
      cityName: '', govName: '', subOrgName: '', orgName: '', cityNameAr: '', govNameAr: '', subOrgNameAr: '', orgNameAr: '', hospitalName: '', hospitalNameAr: ''
    }
    this.userCookieObj = {
      hospitalTypeNum: 0, email: '', strInsitute: '', strInsituteAr: '', strLogo: '', isAgency: false, isScrap: false, isVisit: false, isExternalFix: false, isOpenRequest: false,
      userNameAr: '', id: '', userName: '', roleName: '', roleNames: [], displayName: '', token: '', isRemembered: false, hospitalCode: '',
      governorateId: 0, cityId: 0, organizationId: 0, subOrganizationId: 0, hospitalId: 0, supplierId: 0, commetieeMemberId: 0, canAdd: false,
      cityName: '', govName: '', subOrgName: '', orgName: '', cityNameAr: '', govNameAr: '', subOrgNameAr: '', orgNameAr: '', hospitalName: '', hospitalNameAr: ''
    }



  }
  login() {
    if(this.loggingUserObj.userName=='')
      {
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "Please Insert User Name";
        }
        else {
          this.errorMessage = " من فضلك ادخل اسم المستخدم";
          
        }
        return false;
      }

      if(this.loggingUserObj.passwordHash=='')
        {
          this.errorDisplay = true;
          if (this.lang == "en") {
            this.errorMessage = "Please Insert Your Password";
          }
          else {
            this.errorMessage = " من فضلك أدخل كلمة السر";
            
          }
          return false;
        }
  this.ngxService.start();
    this.authenticationService.login(this.loggingUserObj).subscribe(
      data => {

        this.userObj = this.authenticationService.currentUserValue;
        this.userObj.isRemembered = this.loggingUserObj.isRemembered;

        this.ngxService.stop();
        this.router.navigate(['/dash']);
      },
      error => {
     
        if (this.lang == "en") {
            this.errorMessage = error.error.message;
          }
        else {
            this.errorMessage = error.error.messageAr;
        }
        this.ngxService.stop();
        this.errorDisplay = true;
        return false;
     
      });
  }

  forgetPassword() {
    this.router.navigate(['/forget']);
  }
}
