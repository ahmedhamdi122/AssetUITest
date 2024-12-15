import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { AssetDetailsWithMasterAssetVM, AssetDetailVM } from 'src/app/Shared/Models/assetDetailVM';
import { AssetStatusTransactionVM } from 'src/app/Shared/Models/assetStatusTransactionVM';
import { ListDepartmentVM } from 'src/app/Shared/Models/departmentVM';
import { ListEmployeeVM } from 'src/app/Shared/Models/employeeVM';
import {  ListHospitalVM } from 'src/app/Shared/Models/hospitalVM';
import { ListMasterAssetVM, MasterAssetVM } from 'src/app/Shared/Models/masterAssetVM';
import { Paging } from 'src/app/Shared/Models/paging';
import { IndexProblemVM } from 'src/app/Shared/Models/ProblemVM';
import { IndexRequestTypeVM } from 'src/app/Shared/Models/ProjectTypeVM';
import { CreateRequestDocument } from 'src/app/Shared/Models/RequestDocumentVM';
import { ListRequestVM, RequestModeVM } from 'src/app/Shared/Models/requestModeVM';
import { RequestPeriority } from 'src/app/Shared/Models/RequestPeriorityVM';
import { IndexRequestStatus } from 'src/app/Shared/Models/RequestStatusVM';
import { CreateRequestTracking } from 'src/app/Shared/Models/RequestTrackingVM';
import { CreateRequest, SortAndFilterRequestVM } from 'src/app/Shared/Models/requestVM';
import { IndexSubProblemVM } from 'src/app/Shared/Models/SubProblemVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { AssetDetailService } from 'src/app/Shared/Services/assetDetail.service';
import { AssetStatusTransactionService } from 'src/app/Shared/Services/assetStatusTransaction.service';
import { DepartmentService } from 'src/app/Shared/Services/department.service';
import { EmployeeService } from 'src/app/Shared/Services/employee.service';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { MasterAssetService } from 'src/app/Shared/Services/masterAsset.service';
import { ProblemService } from 'src/app/Shared/Services/problem.service';
import { RequestModeService } from 'src/app/Shared/Services/request-mode.service';
import { RequestPeriorityService } from 'src/app/Shared/Services/request-periority.service';
import { RequestStatusService } from 'src/app/Shared/Services/request-status.service';
import { RequestTrackingService } from 'src/app/Shared/Services/request-tracking.service';
import { RequestTypeService } from 'src/app/Shared/Services/request-type.service';
import { RequestService } from 'src/app/Shared/Services/request.service';
import { SubProblemService } from 'src/app/Shared/Services/sub-problem.service';
import { UploadFilesService } from 'src/app/Shared/Services/uploadfilesservice';
import { HospitalService } from 'src/app/Shared/Services/hospital.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  lang = localStorage.getItem("lang");
  textDir: string = 'ltr';

  reqObj: CreateRequest;
  currentUser: LoggedUser;
  reqId: CreateRequest;
  requestTrackingId: CreateRequestTracking;
  createRequestDocument: CreateRequestDocument;
  assetBarCodeObj: AssetDetailVM;
  assetDepartmentBarCodeObj: AssetDetailVM;
  assetSerialObj: AssetDetailVM;



  isDisabled: boolean = false;
  errorDisplay: boolean = false;
  display: boolean = false;
  errorRequest: boolean = false;
  errorMessage: string = "";
  lstEmployees: ListEmployeeVM[] = [];
  lstMasterAsset: MasterAssetVM[] = [];
  lstassetDetails: AssetDetailVM[] = [];
  lstSerials: AssetDetailVM[] = [];
  lstassetDetailBarcodes: AssetDetailVM[] = [];
  lstDepartmentsBarcode: AssetDetailVM[] = [];
  lstPeriorities: RequestPeriority[] = [];
  lstRequestMode: RequestModeVM[] = [];
  lstCreateRequestDocument: CreateRequestDocument[] = [];
  createRequestTrackingObj: CreateRequestTracking;
  lstOldRequeststatus: IndexRequestStatus[] = [];
  lstProblems: IndexProblemVM[] = [];
  lstSubProblems: IndexSubProblemVM[] = [];
  lstRequestTypes: IndexRequestTypeVM[] = [];
  lstDepartments: ListDepartmentVM[] = [];
  masterAssetObj: any;
  masterAssetObj1: any;
  lsAssetDetailsWithMasterAsset: AssetDetailsWithMasterAssetVM[] = [];
  lstHospitalAssets: AssetDetailVM[] = [];
  lstHospitals: ListHospitalVM[] = [];
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  disabledButton: boolean = false;
  radioPerioritySelected: number;
  isEngManager: boolean = false;
  isAssetOwner: boolean = false;
  isEng: boolean = false;
  isAdmin: boolean = false;
  lstRoleNames: string[] = [];
  isValidDate: any;
  error: any = { isError: false, errorMessage: '' };
  dateError: boolean = false;
  assetId: number;
  formData = new FormData();

  applicationStatus: string = "";
  assetStatusId: number = 0;
  page: Paging;
  count: number;
  startDateTime: Date;
  startStamp: number;
  newDate: Date = new Date();
  newStamp = this.newDate.getTime();
  timer;
  sortStatus: string = "ascending";
  lstOldRequests: ListRequestVM[] = [];
  itmIndex: any[] = [];
  selectedType: number = 1;
  lstTypes: FilterList[] = [];
  showBarcode: boolean = false;
  showSerial: boolean = false;
  showName: boolean = false;
  showDepartment: boolean = false;
  brandName: string;
  serialNumber: string;
  modelNumber: string;
  barCode: string;
  departmentName: string;
  sortFilterObjects: SortAndFilterRequestVM;
  showSuccessfullyMessage:boolean=false;
  SuccessfullyMessage:string='';
  SuccessfullyHeader:string='';
  showHospital:boolean=false;
  showStatus:boolean=false;
  departmentId:number;
  roomName:string='';
  roomNameAr:string='';
  floorName:string='';
  floorNameAr:string='';
  buildName:string=''; 
  buildNameAr:string='';
  assetIsWorking:boolean;
  constructor(private requestService: RequestService, private authenticationService: AuthenticationService,
    private hospitalService: HospitalService,
    private assetStatusTransactionService: AssetStatusTransactionService, private formBuilder: FormBuilder, private activeRoute: ActivatedRoute, private requestStatusService: RequestStatusService,
    private employeeService: EmployeeService, private assetDetailService: AssetDetailService, private messageService: MessageService,
    private requestTrackingService: RequestTrackingService, private ref: DynamicDialogRef, private datePipe: DatePipe,
    private uploadService: UploadFilesService, private masterAssetService: MasterAssetService, private requestPeriorityService: RequestPeriorityService,
    private requestModeService: RequestModeService, private requestTypeService: RequestTypeService, private problemService: ProblemService, private departmentService: DepartmentService,
    private subProblemService: SubProblemService) {

    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit(): void {
    this.showHospital=this.currentUser.hospitalId!=0?false:true;
    this.radioPerioritySelected = 4;
    this.disabledButton = false;
  
    this.reqObj = {
      serialNumber: '', createdById: "", problemId: 0, masterAssetId: 0, requestCode: '', subject: '', requestPeriorityId: 0, requestStatusId: 0, requestTime: new Date().getHours() + ':' + new Date().getMinutes(),
      subProblemId: 0, description: '', requestModeId: 0, assetDetailId: 0, requestTypeId: 0, hospitalId: 0
    }
    this.onLoad()
 
 
  }
  onLoad() {
    this.requestService.GenerateRequestNumber().subscribe(num => {
      this.reqObj.requestCode = num.requestCode;
    });

    this.createRequestDocument = { id: 0, requestTrackingId: 0, fileName: '', documentName: '', requestFile: File, hospitalId: 0 }
    this.createRequestTrackingObj = { strDescriptionDate: '', id: 0, createdById: "", description: '', descriptionDate: new Date(), requestId: 0, requestStatusId: 0, hospitalId: 0 }

    this.requestStatusService.GetAllRequestStatus().subscribe(
      res => {
        this.lstOldRequeststatus = res;
        this.reqObj.requestModeId = 5;
      });

   
    this.requestPeriorityService.GetAllRequestPeriorties().subscribe(
      res => {
        this.lstPeriorities = res;
        this.reqObj.requestPeriorityId = 4;
        // this.isDisabled = true;
      });
    this.requestModeService.GetAllRequetsMode().subscribe(
      res => {
        this.lstRequestMode = res
      });
    this.requestTypeService.GetAllRequestTypes().subscribe(
      res => {
        this.lstRequestTypes = res;
        this.reqObj.requestTypeId = 2;
      });

    if (this.currentUser.hospitalId != 0) {
      this.departmentService.DepartmentsByHospitalId(this.currentUser.hospitalId).subscribe(departments => {
        this.lstDepartments = departments
      });
    }
    else {
      this.departmentService.DepartmentsByHospitalId(this.reqObj.hospitalId).subscribe(departments => {
        this.lstDepartments = departments
      });
    }
    this.hospitalService.GetHospitals(this.currentUser.id).subscribe(hospitals => {
      this.lstHospitals = hospitals;
    });



    
    this.lstTypes = [{ id: 1, name: "Select By Barcode", nameAr: "بحث بالباركود" },
    { id: 2, name: "Select By Serial", nameAr: "بحث بالسيريال" },
    { id: 3, name: "Select By Name", nameAr: "بحث بالإسم" },
    { id: 4, name: "Select By Department", nameAr: "بحث بالقسم" }


    ]
    this.selectedType = 1;

    this.showBarcode = true;
    this.showSerial = false;
    this.showName = false;

  }
  getSelecteditem() {
    this.reqObj.requestPeriorityId = Number(this.radioPerioritySelected);
  }
  GetAllSubProblemsByProblemId($event) {
    this.subProblemService.GetAllSubProblemsByProblemId($event.target.value).subscribe(
      res => {
        this.lstSubProblems = res
      });
  }
 
  AddRequest() {
    var validStatus=true;
     if(this.assetBarCodeObj!=null)
    {
       validStatus=this.findAssetStatusByStatusId(this.assetStatusId);
    }
    if(!validStatus)
    {
      return;
    }
    console.log("this.selectedType :",this.selectedType);
  
    if (this.selectedType == 1) {
      if (this.assetBarCodeObj == undefined) {
        this.resetAssetDetailsFields();
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "Please select asset barcode";
        }
        else {
          this.errorMessage = "من فضلك اختر باركود الجهاز";
        }
        return false;
      }
    }
    if (this.selectedType == 2) {
      if (this.assetSerialObj == undefined) {
        this.resetAssetDetailsFields();
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "Please select asset serial";
        }
        else {
          this.errorMessage = "من فضلك اختر سيريال الجهاز";
        }
        return false;
      }
    }
    if (this.selectedType == 3) {
      if (this.masterAssetObj1 == undefined) {
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "Please select asset";
        }
        else {
          this.errorMessage = "من فضلك اختر جهاز";
        }
        return false;
      }
      else {
        this.reqObj.assetDetailId = this.masterAssetObj1.id;
      }
    }
    if (this.selectedType == 4) {
      if (this.assetDepartmentBarCodeObj == undefined) {
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "Please select asset";
        }
        else {
          this.errorMessage = "من فضلك اختر جهاز";
        }
        return false;
      }
      if (this.departmentId == 0) {
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "Please select department";
        }
        else {
          this.errorMessage = "من فضلك اختر قسم";
        }
        return false;
      }
      else {
        this.reqObj.assetDetailId = this.assetDepartmentBarCodeObj.id;
      }
    }
    if (this.reqObj.subject == "") {
      this.errorDisplay = true;
      if (this.lang == "en") {
        this.errorMessage = "Please add subject";
      }
      else {
        this.errorMessage = "من فضلك اكتب عنوان لبلاغ العطل";
      }
      return false;
    }
    if (this.reqObj.requestModeId == 0) {
      this.errorDisplay = true;
      if (this.lang == "en") {
        this.errorMessage = "Please select mode";
      }
      else {
        this.errorMessage = "من فضلك اختر طريقة التواصل";
      }
      return false;
    }
    if (this.reqObj.requestTypeId == 0) {
      this.errorDisplay = true;
      if (this.lang == "en") {
        this.errorMessage = "Please select type";
      }
      else {
        this.errorMessage = "من فضلك اختر نوع البلاغ";
      }
      return false;
    }
    if (this.radioPerioritySelected == 0) {
      this.errorDisplay = true;
      if (this.lang == "en") {
        this.errorMessage = "Please select periority";
      }
      else {
        this.errorMessage = "من فضلك اختر الأولوية";
      }
      return false;
    }
    if (this.reqObj.description == "") {
      this.errorDisplay = true;
      if (this.lang == "en") {
        this.errorMessage = "Please write description";
      }
      else {
        this.errorMessage = "من فضلك اكتب وصف للعطل";
      }
      return false;
    }
    
    
    
    console.log('this.reqObj.assetDetailId  :',this.reqObj.assetDetailId  )
    this.reqObj.hospitalId = this.currentUser.hospitalId != 0 ? this.currentUser.hospitalId : this.reqObj.hospitalId;
    this.reqObj.createdById = this.currentUser.id;
    
    this.requestService.inserRequest(this.reqObj).subscribe(e => {
      this.reqId = e;
      this.createRequestTrackingObj.requestId = Number(this.reqId)
      this.createRequestTrackingObj.requestStatusId = 1;
      this.createRequestTrackingObj.hospitalId = this.currentUser.hospitalId != 0 ? this.currentUser.hospitalId : this.reqObj.hospitalId;
      this.createRequestTrackingObj.description = this.reqObj.description;
      this.createRequestTrackingObj.createdById = this.currentUser.id;
      
      this.requestTrackingService.AddRequestTracking(this.createRequestTrackingObj).subscribe(e => {
        this.requestTrackingId = e
        var statusObj = new AssetStatusTransactionVM();
        statusObj.assetDetailId = this.reqObj.assetDetailId;
        statusObj.hospitalId = this.currentUser.hospitalId != 0 ? this.currentUser.hospitalId : this.reqObj.hospitalId;
        statusObj.assetStatusId = 4;
        this.assetStatusTransactionService.AddAssetStatusTransaction(statusObj).subscribe(addedStatus => {
        });

        if (this.lstCreateRequestDocument.length > 0) {
          this.lstCreateRequestDocument.forEach((elemnt, index) => {
            elemnt.hospitalId = this.currentUser.hospitalId != 0 ? this.currentUser.hospitalId : this.reqObj.hospitalId;
            elemnt.requestTrackingId = Number(e);
            this.requestService.CreateRequestAttachments(elemnt).subscribe(lstfiles => {
              this.uploadService.uploadRequestFiles(elemnt.requestFile, elemnt.fileName).subscribe(
                (event) => {
                  this.display = true;
                },
                (err) => {
                  if (this.lang == "en") {
                    this.errorDisplay = true;
                    this.errorMessage = 'Could not upload the file:' + elemnt[index].fileName;
                  }
                  else {
                    this.errorDisplay = true;
                    this.errorMessage = 'لا يمكن رفع ملف ' + elemnt[index].fileName;
                  }
                });
            });
          });
          this.display = true;
          this.ref.close("created");
          this.lstCreateRequestDocument = [];
        }
        else {
          this.display = true;
          this.ref.close("created");
          // this.isDisabled = true;
        }
      });
    },
      (error) => {
        this.errorDisplay = true;
        if (this.lang == 'en') {
          if (error.error.status == 'assetId') {
            this.errorMessage = error.error.message;
          }
          if (error.error.status == 'invalidDate') {
            this.errorMessage = error.error.message;
          }
        }
        if (this.lang == 'ar') {
          if (error.error.status == 'assetId') {
            this.errorMessage = error.error.messageAr;
          }
              if (error.error.status == 'invalidDate') {
            this.errorMessage = error.error.messageAr;
          }

        }
        return false;
      });
  }

  findAssetStatusByStatusId(assetStatusId: number): boolean {
    switch (assetStatusId) {
      case 1:
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "You cannot make ticket for this asset because it Needs Repair";
        }
        else {
          this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه يحتاج لإصلاح ";
        }
        this.isDisabled = true;
        break;
      case 2:
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "You cannot make ticket for this asset because it is Scrap";
        }
        else {
          this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه مكهن ";
        }
        this.isDisabled = true;
        break;
      case 4:
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "You cannot make ticket for this asset because it is Under Maintenance";
        }
        else {
          this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه تحت الصيانة";
        }
        this.isDisabled = true;
        break;
      case 5:
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "You cannot make ticket for this asset because it is Under Installation";
        }
        else {
          this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه  تحت الإنشاء";
        }
        this.isDisabled = true;
        break;
      case 6:
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "You cannot make ticket for this asset because it is not working ";
        }
        else {
          this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه لا يعمل ";
        }
        this.isDisabled = true;
        break;
      case 7:
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "You cannot make ticket for this asset because it is Shut Down";
        }
        else {
          this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه متوقف ";
        }
        this.isDisabled = true;
        break;
      case 8:
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "You cannot make ticket for this asset because it is Excluded";
        }
        else {
          this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه مستبعد ";
        }
        this.isDisabled = true;
        break;
      case 9:
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "You cannot make ticket for this asset because it is Hold";
        }
        else {
          this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه في حالة إيقاف مؤقت ";
        }
        this.isDisabled = true;
        break;
        default:
          return true;
    }
  }
  onHospitalChange()
  {    
    this.assetBarCodeObj=undefined;
    this.assetSerialObj=undefined;
    this.applicationStatus='';
    this.resetAssetDetailsFields();
    this.isDisabled=false;
    this.showStatus=false;
  }
  getBarCode(assetBarCodeObj:any) {

    console.log('assetBarCodeObj :',assetBarCodeObj )
    this.reqObj.assetDetailId=assetBarCodeObj.id;
    this.assetStatusId=this.assetBarCodeObj.assetStatusId;
    this.findAssetStatusByStatusId( this.assetStatusId);
    this.reqObj.hospitalId=assetBarCodeObj.hospitalId
    var assetId = assetBarCodeObj["id"];
    this.applicationStatus = this.lang == "en" ? this.assetBarCodeObj["assetStatus"] : this.assetBarCodeObj["assetStatusAr"];
    this.showStatus=true;
    this.assetIsWorking=this.assetBarCodeObj.assetStatus=="Working"?true:false;
    this.requestService.GetOldRequestsByHospitalAssetId(assetId).subscribe(items => {
      this.lstOldRequests = items;
    });
    
    this.brandName = this.lang == 'en' ? assetBarCodeObj["brandName"] : assetBarCodeObj["brandNameAr"];
    this.modelNumber = assetBarCodeObj["model"];
    this.serialNumber = assetBarCodeObj["serialNumber"];
    this.barCode = assetBarCodeObj["barCode"];
    this.departmentName = this.lang == 'en' ? assetBarCodeObj["departmentName"] : assetBarCodeObj["departmentNameAr"];
   

          
  
  }

  resetAssetDetailsFields()
  {
    this.isDisabled=false;
    this.lstOldRequests=[];
    this.applicationStatus='';
    this.showStatus=false;
    this.brandName='';
    this.modelNumber='';
    this.serialNumber='';
    this.barCode='';
    this.departmentName='';
    this.roomName='';
    this.roomNameAr='';
    this.floorName='';
    this.floorNameAr='';
    this.buildName=''; 
    this.buildNameAr='';
  }
  onSelectionChanged(event) {
    this.assetBarCodeObj=undefined;
    this.lstOldRequests=[];
    this.applicationStatus='';
    this.showStatus=false;
    this.isDisabled = false;
    this.assetStatusId=0;
    this.resetAssetDetailsFields();
    var hospitalId=this.reqObj.hospitalId;
    
      this.assetDetailService.AutoCompleteAssetBarCode(event.query, hospitalId,this.currentUser.id).subscribe(assets => {
        this.lstassetDetailBarcodes = assets;
        if (this.lang == "en") {
          this.lstassetDetailBarcodes.forEach(item => item.name = item.barCode);
        }
        else {
          this.lstassetDetailBarcodes.forEach(item => item.name = item.barCode);
        }
      });
  }
  getSerial(assetSerialObj) {
    this.assetStatusId=this.assetSerialObj.assetStatusId;
    this.findAssetStatusByStatusId( this.assetStatusId);

    this.applicationStatus = this.lang == "en" ? this.assetSerialObj["assetStatus"] : this.assetSerialObj["assetStatusAr"];
    this.showStatus=true;
    this.assetIsWorking=this.assetSerialObj.assetStatus=="Working"?true:false;
    this.reqObj.hospitalId=assetSerialObj.hospitalId
     this.assetSerialObj.serialNumber = assetSerialObj["serialNumber"];
    this.assetSerialObj.id = assetSerialObj["id"];
    this.brandName = this.lang == 'en' ? assetSerialObj["brandName"] : assetSerialObj["brandNameAr"];
    this.modelNumber = assetSerialObj["model"];
    this.serialNumber = assetSerialObj["serialNumber"];
    this.barCode = assetSerialObj["barCode"];
    this.assetId = assetSerialObj["id"];

    this.requestService.GetOldRequestsByHospitalAssetId(assetSerialObj.id).subscribe(items => {
      this.lstOldRequests = items;
    });

  }
  onSerialSelectionChanged(event) {
    
    this.assetSerialObj=undefined;
    this.applicationStatus='';
    this.showStatus=false;
    this.resetAssetDetailsFields();
    this.isDisabled = false;
    var hospitalId=this.reqObj.hospitalId;
    this.isDisabled = false;
   
      this.assetDetailService.AutoCompleteAssetSerial(event.query, hospitalId,this.currentUser.id).subscribe(assets => {
        this.lstSerials = assets;
        if (this.lang == "en") {
          this.lstSerials.forEach(item => item.serialNumber = item.serialNumber);
        }
        else {
          this.lstSerials.forEach(item => item.serialNumber = item.serialNumber);
        }
      });
    
   
  }
  getDepartmentsBarcode(event) {
    this.assetDepartmentBarCodeObj.barCode = event["barCode"];
    this.assetDepartmentBarCodeObj.id = event["id"];
    var assetId = event["id"];

    this.assetId = event["id"];
    this.requestService.GetOldRequestsByHospitalAssetId(assetId).subscribe(items => {
      this.lstOldRequests = items;
    });

    this.brandName = this.lang == 'en' ? event["brandName"] : event["brandNameAr"];
    this.modelNumber = event["model"];
    this.serialNumber = event["serialNumber"];
    this.barCode = event["barCode"];
    this.departmentName = this.lang == 'en' ? event["departmentName"] : event["departmentNameAr"];

    if (this.currentUser.hospitalId != 0) {
      this.assetDetailService.GetAssetNameByMasterAssetIdAndHospitalId(Number(event["masterAssetId"]), this.currentUser.hospitalId).subscribe(
        res => {
          this.lstassetDetails = res;
          this.reqObj.assetDetailId = event["id"];
          this.reqObj.masterAssetId = event["masterAssetId"];
          this.lstOldRequests = [];
          this.assetDetailService.GetHospitalAssetById(this.reqObj.assetDetailId).subscribe(assetObj => {
            this.assetDepartmentBarCodeObj = assetObj;
            if (this.assetBarCodeObj["assetStatusAr"] == null) {
              this.isDisabled = true;
              this.errorDisplay = true;
              this.errorMessage = "هذا الجهاز لا يوجد ضمن الأجهزة التي تعمل داخل النظام";
              return false;
            }
            if (this.assetBarCodeObj["assetStatus"] == null) {
              this.isDisabled = true;
              this.errorDisplay = true;
              this.errorMessage = "This asset is not working in system";
              return false;
            }

            this.applicationStatus = this.lang == "en" ? this.assetDepartmentBarCodeObj["assetStatus"] : this.assetDepartmentBarCodeObj["assetStatusAr"];
            this.assetDepartmentBarCodeObj.name = assetObj["barcode"];
            this.assetStatusId = this.assetDepartmentBarCodeObj["assetStatusId"];

            var isWorking = this.findAssetStatusByStatusId(this.assetStatusId);
            if (isWorking == false) {
              return false;
            }
            else {
              this.isDisabled = false;
            }
          });
        });
    }
    else {
      this.assetDetailService.GetAssetNameByMasterAssetIdAndHospitalId(Number(event["masterAssetId"]), this.reqObj.hospitalId).subscribe(
        res => {
          this.lstassetDetails = res;
          this.reqObj.assetDetailId = event["id"];
          this.reqObj.masterAssetId = event["masterAssetId"];
          this.lstOldRequests = [];
          this.assetDetailService.GetHospitalAssetById(this.reqObj.assetDetailId).subscribe(assetObj => {
            this.assetDepartmentBarCodeObj = assetObj;


            if (this.assetBarCodeObj["assetStatusAr"] == null) {
              this.isDisabled = true;
              this.errorDisplay = true;
              this.errorMessage = "هذا الجهاز لا يوجد ضمن الأجهزة التي تعمل داخل النظام";
              return false;
            }
            if (this.assetBarCodeObj["assetStatus"] == null) {
              this.isDisabled = true;
              this.errorDisplay = true;
              this.errorMessage = "This asset is not working in system";
              return false;
            }
            this.applicationStatus = this.lang == "en" ? this.assetDepartmentBarCodeObj["assetStatus"] : this.assetDepartmentBarCodeObj["assetStatusAr"];
            this.assetDepartmentBarCodeObj.name = assetObj["barcode"];
            this.assetStatusId = this.assetDepartmentBarCodeObj["assetStatusId"];

             this.findAssetStatusByStatusId(this.assetStatusId);
         
          });
        });
    }
  }
  onDepartmentsBarcodeSelectionChanged(event) {
    if (this.currentUser.hospitalId != 0) {
      this.assetDetailService.AutoCompleteAssetBarCodeByDepartmentId(event.query, this.currentUser.hospitalId, this.departmentId).subscribe(assets => {
        this.lstDepartmentsBarcode = assets;
        this.lstDepartmentsBarcode.forEach(item => item.name = item.barCode);
      });
    }
    else {
      this.assetDetailService.AutoCompleteAssetBarCodeByDepartmentId(event.query, this.reqObj.hospitalId, this.departmentId).subscribe(assets => {
        this.lstDepartmentsBarcode = assets;
        this.lstDepartmentsBarcode.forEach(item => item.name = item.barCode);
      });
    }
  }
  onMasterAssetSelectionChanged(event) {
    
    this.applicationStatus='';
    this.showStatus=false;
    this.resetAssetDetailsFields();
    this.isDisabled = false;
    var hospitalId=this.reqObj.hospitalId;
    this.masterAssetService.AutoCompleteMasterAssetName(event.query, hospitalId,this.currentUser.id).subscribe(masters => {
      this.lsAssetDetailsWithMasterAsset = masters;
      if (this.lang == "en") {
        this.lsAssetDetailsWithMasterAsset.forEach(item => item.name = item.masterAsseName + " - " + item.masterAsseBrandName + " - " + item.masterAsseModelNumbe + " - " + item.serialNumber+" - "+item.barcode);
      }
      else {
        this.lsAssetDetailsWithMasterAsset.forEach(item => item.name = item.masterAsseNameAr + " - " + item.masterAsseBrandNameAr + " - " + item.masterAsseModelNumbe + " - " + item.serialNumber+" - "+item.barcode);
      }
    });
  }
  getMasterAssetObject(event) {
    
    this.lstHospitalAssets = [];
    this.masterAssetObj1.id = event["id"];
    this.reqObj.assetDetailId = event["id"];

    this.assetId = event["id"];
    this.requestService.GetOldRequestsByHospitalAssetId(event["id"]).subscribe(items => {
      this.lstOldRequests = items;
      
    });
    this.brandName = this.lang == 'en' ? event["brandName"] : event["brandNameAr"];
    this.modelNumber = event["model"];
    this.serialNumber = event["serialNumber"];
    this.barCode = event["barCode"];


  }
  onTypeChange($event) {
    this.assetStatusId=0;
    this.showStatus=false;
    this.resetAssetDetailsFields();
    this.isDisabled=false;
    this.lstOldRequests=[];
    let typeId = $event.value;
    this.selectedType = typeId;
    if (this.selectedType == 1) {
      this.showBarcode = true;
      this.showSerial = false;
      this.showName = false;
      this.showDepartment = false;
      this.lstMasterAsset = [];
    
      this.assetBarCodeObj = null;
      this.assetSerialObj = null;
      this.masterAssetObj1 = null;
      this.reqObj.masterAssetId = 0;
    }
    if (this.selectedType == 2) {
      this.showBarcode = false;
      this.showSerial = true;
      this.showName = false;
      this.showDepartment = false;
      this.lstMasterAsset = [];
    
      this.assetBarCodeObj = null;
      this.assetSerialObj = null;
      this.masterAssetObj1 = null;
      this.reqObj.masterAssetId = 0;
    }
    if (this.selectedType == 3) {
      this.showBarcode = false;
      this.showSerial = false;
      this.showName = true;
      this.showDepartment = false;
      this.assetBarCodeObj = null;
      this.masterAssetObj1 = null;
      this.assetSerialObj = null;
      this.reqObj.masterAssetId = 0;
    }
    if (this.selectedType == 4) {
      this.showBarcode = false;
      this.showSerial = false;
      this.showName = false;
      this.showDepartment = true;
      this.assetBarCodeObj = null;
      this.masterAssetObj1 = null;
      this.assetSerialObj = null;
      this.assetDepartmentBarCodeObj = null;
      this.reqObj.masterAssetId = 0;
    }
  }

  closeDialogue() {
    this.ref.close();
  }
  uploadMultipleFile = (event: any) => {
    const files: FileList = event.target.files;
    if (files.length === 0) {
      return;
    }
    else {
      for (var i = 0; i < files.length; i++) {
        let fileToUpload = <File>files[i];
        var requestDocumentObj = new CreateRequestDocument();
        this.formData.append('file', fileToUpload, fileToUpload.name);
        requestDocumentObj.fileName = fileToUpload.name;
        requestDocumentObj.requestFile = fileToUpload;
        requestDocumentObj.documentName = fileToUpload.name.split('.')[0];
        this.lstCreateRequestDocument.push(requestDocumentObj);
      }
      this.addMultiFilesToList();
    }
  }
  addMultiFilesToList() {
    this.lstCreateRequestDocument.forEach((element, index) => {
      element.requestTrackingId = Number(this.requestTrackingId)
      if (this.itmIndex.length === 0) {
        last_element = 1;
      }
      else if (this.itmIndex.length > 0) {
        var last_element = this.itmIndex[this.itmIndex.length - 1];
        last_element = last_element + 1;
      }
      this.itmIndex.push(last_element);
      let ext = element.fileName.split('.').pop();
      var hCode = this.pad(this.currentUser.hospitalCode, 4);
      var srCode = this.pad(this.reqObj.requestCode, 10);
      var last = this.itmIndex[this.itmIndex.length - 1];
      let newIndex = this.pad((last).toString(), 2);
      let SRFileName = hCode + "SR" + srCode + newIndex;
      element.fileName = SRFileName + "." + ext;
      element = { id: 0, fileName: '', requestTrackingId: 0, documentName: '', requestFile: File, hospitalId: 0 };
    });
  }
  removeFileFromObjectArray(rowIndex) {
    let newIndex;
    if (rowIndex >= 0 && rowIndex < this.lstCreateRequestDocument.length) {
      this.lstCreateRequestDocument.splice(rowIndex, 1);

      this.lstCreateRequestDocument.forEach((element, index) => {
        element.requestTrackingId = Number(this.requestTrackingId)
        if (this.itmIndex.length === 0) {
          last_element = 1;
        }
        else if (this.itmIndex.length > 0 && this.lstCreateRequestDocument.length == 0) {
          var last_element = this.itmIndex[this.itmIndex.length - 1];
          last_element = last_element + 1;
        }
        else if (this.itmIndex.length > 0 && this.lstCreateRequestDocument.length > 0) {
          const incrementedIndex = index + 1;
          newIndex = this.pad((incrementedIndex).toString(), 2);
        }
        this.itmIndex.push(last_element);
        let ext = element.fileName.split('.').pop();
        var hCode = this.pad(this.currentUser.hospitalCode, 4);
        var srCode = this.pad(this.reqObj.requestCode, 10);
        let SRFileName = hCode + "SR" + srCode + newIndex;
        element.fileName = SRFileName + "." + ext;
        element = { id: 0, fileName: '', requestTrackingId: 0, documentName: '', requestFile: File, hospitalId: 0 };
      });

    }
  }
  pad(num: string, size: number): string {
    while (num.length < size) num = "0" + num;
    return num;
  }
}


export class FilterList {
  id: number;
  name: string;
  nameAr: string;
}