import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { Breadcrumb } from '../../../../src/app/Shared/Models/breadcrumb.model';
import { IndexRequestTrackingVM } from '../../../../src/app/Shared/Models/RequestTrackingVM';
import { LoggedUser } from '../../../../src/app/Shared/Models/userVM';
import { AuthenticationService } from '../../../../src/app/Shared/Services/guards/authentication.service';
import { RequestService } from '../../../../src/app/Shared/Services/request.service';
import { ForgetPasswordComponent } from '../../authenticate/forget-password/forget-password.component'
 import { DialogService } from 'primeng/dynamicdialog';
import { ListContractDetailVM } from '../../../../src/app/Shared/Models/contractDetailVM';
import { MasterContractService } from '../../../../src/app/Shared/Services/masterContract.service';
import { BreadcrumbService } from '../../../../src/app/Shared/Services/Breadcrumb.service';
import { ListRequestVM } from '../../Shared/Models/requestModeVM';
import { ModuleWithPermissionNames, SectionModulePermisisons } from 'src/app/Shared/Models/Module';

@Component({
  selector: 'app-topheader',
  templateUrl: './topheader.component.html',
  styleUrls: ['./topheader.component.scss']
})
export class TopheaderComponent implements OnInit {
  user: LoggedUser;
  currentUser: LoggedUser;
  lstRoleNames: string[] = [];
  lstOpenRequests: ListRequestVM[] = [];
  lstRequestTracks: IndexRequestTrackingVM[] = [];
  countRequests: number;

  Lang: any;
  href: any;
  textDir: string = "rtl";
  direction = localStorage.getItem('dir');
  lang = localStorage.getItem("lang");
  userName = "";
  breadcrumbs$: Observable<Breadcrumb[]>;

  isSuperAdmin: boolean = false;
  isAdmin: boolean = false;
  isDashboard: boolean = false;
  isHospital: boolean = false;
  isSetting: boolean = false;
  isMaintainance: boolean = false;
  isPMMaintainance: boolean = false;
  isCMMaintainance: boolean = false;
  isAsset: boolean = false;
  isAssetOwner: boolean = false;
  isEngManager: boolean = false;
  isHospitalManager: boolean = false;
  isMasterAsset: boolean = false;
  isHospitalAsset: boolean = false;
  isEmployee: boolean = false;
  isContract: boolean = false;
  isServiceRequest: boolean = false;
  isBuilding: boolean = false;
  isWorkOrder: boolean = false;
  isSupplier: boolean = false;
  isMember: boolean = false;
  isSupplierExeclude: boolean = false;
  isHospitalExeclude: boolean = false;
  isMemberlExeclude: boolean = false;
  isListHospitalAsset: boolean = false;
  isVisitEngineer: boolean = false;
  isVisitEngineerManager: boolean = false;
  isSRCreator: boolean = false;
  isSRReviewer: boolean = false;
  isAddSTSchedule: boolean = false;
  isAOSTAssets: boolean = false;
  isExternalFix: boolean = false;
  isContracts: boolean = false;
  isScrap: boolean = false;
  isQRReport: boolean = false;
  isAssetMovement: boolean = false;
  isHospitalAssetMovement: boolean = false;
  isExternalFixMovement: boolean = false;
  isBrandPMGenerateData: boolean = false;
  isBrandPMListData: boolean = false;
  isBrandPMCalender: boolean = false;
  isWNPMGenerateData: boolean = false;
  isWNPMListData: boolean = false;
  isWNPMCalender: boolean = false;
  isWNPMDelay: boolean = false;
  isWNPMFIX: boolean = false;
  isBrandPMFIX: boolean = false;
  isBrandPMDelay: boolean = false;
  isGEOReport: boolean = false;
  isSettingAdmin: boolean = false;
  selectedLang: string;
  lstContracts: ListContractDetailVM[] = [];
  contractSubject: string = "";
  title: string = "";
  hospitalName: string = "";
  showSR: boolean = false;
  showIncomeSR: boolean = false;
  showManufacturePM: boolean = false;
  showATSchedule: boolean = false;
  showAssetST: boolean = false;
  arrayLength: number = 0;
  collapseStates = new Map<string, boolean>();
  SectionModulePermisisons:SectionModulePermisisons[];
  constructor(public translate: TranslateService, private route: Router,
    private authenticationService: AuthenticationService,
    private requestService: RequestService, private masterContractService: MasterContractService,
    public breadcrumbService: BreadcrumbService, public dialogService: DialogService,

  ) {
    this.currentUser = this.authenticationService.currentUserValue;
    translate.addLangs(['en', 'ar']);
    this.authenticationService.setAllModulesPermissionsforcurrentUser();
    this.authenticationService.AllModulesPermissionsForCurrentUser$.subscribe(
      res=>
        {
          this.SectionModulePermisisons=res          
        }
    )
    this.currentUser = this.authenticationService.currentUserValue;
    if (this.currentUser != null && this.currentUser.hospitalId != 0) {
      if (this.lang == "en") {
        if (this.currentUser["hospitalName"] != "") {
          this.hospitalName = this.currentUser["hospitalName"];
        }
        else {
          this.hospitalName = "";
        }
      }
      else {
        if (this.currentUser["hospitalNameAr"] != "") {
          this.hospitalName = this.currentUser["hospitalNameAr"];
        }
        else {
          this.hospitalName = "";
        }
      }

      // this.masterContractService.GetContractByHospitalId(Number(this.currentUser["hospitalId"])).subscribe(list => {
      //   if (list.length !== 0) {
      //     this.lstContracts = list;
      //     this.contractSubject = this.lstContracts[0].contractName;
      //   }
      // });
    }


  }
  


  ngOnInit(): void {   
        
      
    if (this.breadcrumbService.breadcrumbs$) {
      this.breadcrumbs$ =this.breadcrumbService.breadcrumbs$;
    }
   
  }
  toggleCollapse(sectionId: string) {
    const currentState = this.collapseStates.get(sectionId) || false;
    this.collapseStates.set(sectionId, !currentState);
  }

  isCollapsed(sectionId: string): boolean {
    return this.collapseStates.get(sectionId) || false;
  }
  selectLanguage(lang: string) {

    let currentUrl = this.route.url;
    localStorage.setItem('lang', lang);
    if(lang=='en')
    {
      localStorage.setItem('dir', 'ltr');
    }
    else{
    localStorage.setItem('dir', 'rtl');
    }
    this.translate.use(lang);
    this.route.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.onSameUrlNavigation = 'reload';
    this.route.navigate([currentUrl]);
  }
  logout() {
    this.authenticationService.logout();
  }
  forgetPassword() {
    const dialogRef2 = this.dialogService.open(ForgetPasswordComponent, {
      header: this.lang == "en" ? 'Change Password' : "تغيير كلمة المرور",
      width: '40%',
      style: {
        'dir': this.lang == "en" ? 'ltr' : "rtl",
        "text-align": this.lang == "en" ? 'left' : "right",
        "direction": this.lang == "en" ? 'ltr' : "rtl"
      }
    });
    dialogRef2.onClose.subscribe((res) => {
      //this.reload();
    });


  }


  openRequest(requestId) {
    this.requestService.UpdateOpenedRequest(requestId).subscribe(requests => {
      let currentUrl = this.route.url;
      this.route.routeReuseStrategy.shouldReuseRoute = () => false;
      this.route.onSameUrlNavigation = 'reload';
      this.route.navigate([currentUrl]);
    });

  }

  openRequestTrack(trackId) {
    this.requestService.UpdateOpenedRequestTrack(trackId).subscribe(requests => {
      let currentUrl = this.route.url;
      this.route.routeReuseStrategy.shouldReuseRoute = () => false;
      this.route.onSameUrlNavigation = 'reload';
      this.route.navigate([currentUrl]);
    });
  }


}

export interface MenuItem {
  label: string;
  icon: string;
  showOnMobile: boolean;
  showOnTablet: boolean;
  showOnDesktop: boolean;
}
