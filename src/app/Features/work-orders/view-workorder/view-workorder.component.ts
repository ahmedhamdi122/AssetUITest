import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IndexAssetWorkOrderTaskVM } from 'src/app/Shared/Models/AssetWorkOrderTaskVM';
import { ListCityVM } from 'src/app/Shared/Models/cityVM';
import { ListEmployeeVM } from 'src/app/Shared/Models/employeeVM';
import { ListGovernorateVM } from 'src/app/Shared/Models/governorateVM';
import { ListHospitalVM } from 'src/app/Shared/Models/hospitalVM';
import { ListOrganizationVM } from 'src/app/Shared/Models/organizationVM';
import { ListRequestVM } from 'src/app/Shared/Models/requestModeVM';
import { ListSubOrganizationVM } from 'src/app/Shared/Models/subOrganizationVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { CreateWorkOrderAttachmentVM, IndexWorkOrderAttachmentVM } from 'src/app/Shared/Models/WorkOrderAttachmentVM';
import { IndexWorkOrderPeriorityVM } from 'src/app/Shared/Models/WorkOrderPeriorityVM';
import { ListWorkOrderStatusVM } from 'src/app/Shared/Models/WorkOrderStatusVM';
import { CreateWorkOrderTrackingVM, EditWorkOrderTrackingVM, IndexWorkOrderTrackingVM } from 'src/app/Shared/Models/WorkOrderTrackingVM';
import { IndexWorkOrderTypeVM } from 'src/app/Shared/Models/WorkOrderTypeVM';
import { EditWorkOrderVM, IndexWorkOrderVM } from 'src/app/Shared/Models/WorkOrderVM';
import { AssetWorkOrderTaskService } from 'src/app/Shared/Services/asset-work-order-task.service';
import { CityService } from 'src/app/Shared/Services/city.service';
import { EmployeeService } from 'src/app/Shared/Services/employee.service';
import { GovernorateService } from 'src/app/Shared/Services/governorate.service';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { HospitalService } from 'src/app/Shared/Services/hospital.service';
import { OrganizationService } from 'src/app/Shared/Services/organization.service';
import { RequestService } from 'src/app/Shared/Services/request.service';
import { SubOrganizationService } from 'src/app/Shared/Services/subOrganization.service';
import { UploadFilesService } from 'src/app/Shared/Services/uploadfilesservice';
import { WorkOrderAttachmentService } from 'src/app/Shared/Services/work-order-attachment.service';
import { WorkOrderPeriorityService } from 'src/app/Shared/Services/work-order-periority.service';
import { WorkOrderStatusService } from 'src/app/Shared/Services/work-order-status.service';
import { WorkOrderTrackingService } from 'src/app/Shared/Services/work-order-tracking.service';
import { WorkOrderTypeService } from 'src/app/Shared/Services/work-order-type.service';
import { WorkOrderService } from 'src/app/Shared/Services/work-order.service';
import { environment } from 'src/environments/environment';
import { RequestDocumentService } from 'src/app/Shared/Services/request-document.service';
import { ListRequestDocumentVM } from 'src/app/Shared/Models/RequestDocumentVM';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin } from 'rxjs';
import { EditWorkOrderTrackComponent } from '../edit-work-order-track/edit-work-order-track.component';


@Component({
  selector: 'app-view-workorder',
  templateUrl: './view-workorder.component.html',
  styleUrls: ['./view-workorder.component.css']
})
export class ViewWorkorderComponent implements OnInit {

  lang = localStorage.getItem('lang');
  currentUser: LoggedUser;
  lstWorkOrderPeriority: IndexWorkOrderPeriorityVM[]
  lstWorkOrderType: IndexWorkOrderTypeVM[]
  serviceRequestId: number;
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  tracksFormGroup: FormGroup;
  editWorkOrderObj: EditWorkOrderVM;
  requestObj: ListRequestVM;
  lstTracks: IndexWorkOrderTrackingVM[] = [];
  lstDocuments: IndexWorkOrderAttachmentVM[] = [];
  //lstTasks: IndexAssetWorkOrderTaskVM[] = [];
  lstTasks: IndexAssetWorkOrderTaskVM[] = [];
  isSRShowFiles: boolean = false;
  isShowFiles: boolean = false;
  creatWorkOrderTrackingObj: CreateWorkOrderTrackingVM;
  lstEngEmployees: ListEmployeeVM[] = [];
  isClosed: boolean = false;
  isDisabled: boolean = false;
  isAdminDisabled: boolean = false;
  lstWOStatus: ListWorkOrderStatusVM[] = [];
  display: boolean = false;
  errorMessage: string;
  errorDisplay: boolean = false;
  WorkOrderObj: IndexWorkOrderVM
  disabledButton: boolean = false;
  IsSaveProject: boolean = false;
  workOrderId: number = 0;
  isShowDocs: boolean = false;


  CreateWorkOrderAttachmentObj: CreateWorkOrderAttachmentVM
  workOrderTrackingId: number
  lstCreateWorkOrderTracking: CreateWorkOrderAttachmentVM[] = [];
  lstSaveCreateWorkOrderTracking: CreateWorkOrderAttachmentVM[] = [];

  isAdmin: boolean = false;
  lstGovernorates: ListGovernorateVM[];
  lstCities: ListCityVM[];
  lstOrganizations: ListOrganizationVM[];
  lstSubOrganizations: ListSubOrganizationVM[];
  lstHospitals: ListHospitalVM[] = [];
  hospitalId: number;

  lstSRDocuments: ListRequestDocumentVM[] = [];
  CreateWorkOrderattach: CreateWorkOrderAttachmentVM
  lstAttachmentFiles: IndexWorkOrderAttachmentVM[] = [];
  minplannedStartDate: Date = new Date();
  minActualStartDate: Date = new Date();
  plannedStartDate: any;
  ActualStartDate: any;
  planndedEndDate: any;
  ActualEndDate: any;
  minDate: Date;


  requestId: number;

  isAdminRole: boolean = false;
  isEngManager: boolean = false;
  isEng: boolean = false;
  lstRoleNames: string[] = [];

  startDateTime: Date;// = new Date(2021, 11, 7, 23, 59, 59, 0); // YYYY (M-1) D H m s ms (start time and date from DB)
  startStamp: number;
  newDate: Date = new Date();
  newStamp = this.newDate.getTime();
  timer; // for storing the interval (to stop or pause later if needed)

  editWorkOrderTrackingObj: EditWorkOrderTrackingVM;
  statusId: number = 0;
  updateWorkOrderNote: boolean = false;
  constructor(private DialogService:DialogService,private confirmationService:ConfirmationService,private spinner:NgxSpinnerService,private authenticationService: AuthenticationService, private requestDocumentService: RequestDocumentService,
    private config: DynamicDialogConfig, private workOrderType: WorkOrderTypeService, private workOrderPeriorityService: WorkOrderPeriorityService, private _formBuilder: FormBuilder, private workOrderservice: WorkOrderService,
    private messageService: MessageService, private router: Router, private workOrderTrackingService: WorkOrderTrackingService,
    private uploadService: UploadFilesService, private httpClient: HttpClient, private workOrderStatusService: WorkOrderStatusService,
    private requestService: RequestService, private employeeService: EmployeeService, private datePipe: DatePipe, private assetWorkOrderTaskService: AssetWorkOrderTaskService,
    private workOrderAttachmentService: WorkOrderAttachmentService,
    private organizationService: OrganizationService, private subOrganizationService: SubOrganizationService, private cityService: CityService,
    private governorateService: GovernorateService, private hospitalService: HospitalService, private ref: DynamicDialogRef,
    public datepipe: DatePipe) {
    this.currentUser = this.authenticationService.currentUserValue;
  }


  onLoad() {
    this.editWorkOrderObj = {
      workOrderTypeName: '', workOrderTypeNameAr: '',
      id: 0, workOrderStatusId: 0, workOrderTrackingId: 0, masterAssetId: 0, hospitalId: 0, cityId: 0, governorateId: 0,
      organizationId: 0, subOrganizationId: 0, periorityName: '', periorityNameAr: '', typeName: '', typeNameAr: '',
      actualEndDate: new Date, actualStartDate: new Date, plannedEndDate: new Date, plannedStartDate: new Date, barCode: '',
      createdById: '', requestId: 0, subject: '', creationDate: new Date, note: '', workOrderNumber: '',
      workOrderPeriorityId: 0, workOrderTypeId: 0
    }
    this.creatWorkOrderTrackingObj = {
      id: 0, notes: '', createdById: '', creationDate: '', workOrderDate: '', workOrderId: 0, workOrderStatusId: 0,
      assignedTo: '', actualEndDate: '', actualStartDate: '', plannedEndDate: '', plannedStartDate: '', hospitalId: 0, strWorkOrderDate: ''
    }
    this.CreateWorkOrderAttachmentObj = { documentName: '', fileName: '', workOrderTrackingId: 0, workOrderFile: File, hospitalId: 0 }
    this.CreateWorkOrderattach = { documentName: '', fileName: '', workOrderTrackingId: 0, workOrderFile: File, hospitalId: 0 }
    this.editWorkOrderTrackingObj = {
      id: 0, notes: '', createdById: '', creationDate: new Date, workOrderDate: new Date, workOrderId: 0, workOrderStatusId: 1
    }
    if (this.config.data != null || this.config.data != undefined) {
      let statusId = this.config.data.statusId;
      if (statusId != undefined) {
        this.statusId = statusId;
      }
    }
    else {
      this.statusId = 0;
    }
  }


  getDocuments(trackid: number) {
    console.log('trackid :', trackid)
    this.workOrderAttachmentService.GetWorkOrderAttachmentsByWorkOrderTrackingId(trackid).subscribe(lstdocs => {
      this.lstDocuments = lstdocs;
    });
    this.isShowFiles = true;
  }

  getSRDocuments(trackid: number) {
    this.requestDocumentService.GetRequestDocumentsByRequestTrackingId(trackid).subscribe(lstdocs => {
      this.lstSRDocuments = lstdocs;
    });

    this.isSRShowFiles = true;
  }
  GetActualStartDate($event) {
    this.ActualStartDate = $event.target.value;
  }
  GetActualEndDate($event) {
    this.ActualEndDate = $event.target.value;
  }


  getCitiesByGovId($event) {
    this.cityService.GetCitiesByGovernorateId($event.target.value).subscribe((cities) => {
      this.lstCities = cities;
    });
  }

  getSubOrgByOrgId($event) {
    this.subOrganizationService.GetSubOrganizationByOrgId($event.target.value).subscribe(suborgs => {
      this.lstSubOrganizations = suborgs;
    });
  }
  getHospitalsBySubOrgId($event) {
    this.hospitalService
      .GetHospitalsBySubOrganizationId($event.target.value)
      .subscribe((hospitals) => {
        this.lstHospitals = hospitals;
      });
  }
  getHospitalId($event) {
    this.hospitalId = $event.target.value;
    this.employeeService
      .GetEmployeesHasEngRoleInHospital(this.hospitalId)
      .subscribe((lstemployees) => {
        this.lstEngEmployees = lstemployees;
      });
  }

  ngOnInit(): void {
   this.spinner.show();
    this.onLoad();
    this.workOrderId = this.config.data.id;
    forkJoin([ this.requestService.GetRequestByWorkOrderId(this.workOrderId), this.workOrderservice.GetWorkOrderById(this.workOrderId)]).subscribe(
      ([reqObj, woObj]) => {
        this.requestObj = reqObj;
        this.editWorkOrderObj = woObj;
        this.workOrderTrackingService.GetTrackOfWorkOrderByWorkOrderId(woObj.id).subscribe(tracks => {
          this.lstTracks = tracks;
          console.log(' this.lstTracks  :', this.lstTracks  )
          this.spinner.hide();
        });
  })
  }
  downloadFile(fileName) {
    var filePath = `${environment.Domain}UploadedAttachments/`;
    this.uploadService.downloadWorkOrderFile(fileName).subscribe(file => {
      var dwnldFile = filePath + 'WorkOrderFiles/' + fileName;
      if (fileName != "" || fileName != null)
        window.open(dwnldFile);
    })
  }
  downloadSRFile(fileName) {
    var filePath = `${environment.Domain}UploadedAttachments/`;
    this.uploadService.downloadRequestTrackFile(fileName).subscribe(file => {
      var dwnldFile = filePath + 'RequestDocuments/' + fileName;
      if (fileName != "" || fileName != null) {
        window.open(dwnldFile);
      }
    })
  }
 


  trackId: number = 0;

 
  
  closeUpdate() {
    this.ref.close();
  }
}
