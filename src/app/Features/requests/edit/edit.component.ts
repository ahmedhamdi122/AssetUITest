import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AssetDetailVM } from 'src/app/Shared/Models/assetDetailVM';
import { MasterAssetVM } from 'src/app/Shared/Models/masterAssetVM';
import { EditRequest } from 'src/app/Shared/Models/requestVM';
import { ListRequestVM, RequestModeVM } from 'src/app/Shared/Models/requestModeVM';
import { RequestPeriority } from 'src/app/Shared/Models/RequestPeriorityVM';
import { AssetDetailService } from 'src/app/Shared/Services/assetDetail.service';
import { MasterAssetService } from 'src/app/Shared/Services/masterAsset.service';
import { RequestService } from 'src/app/Shared/Services/request.service';
import { RequestPeriorityService } from 'src/app/Shared/Services/request-periority.service';
import { RequestModeService } from 'src/app/Shared/Services/request-mode.service';
import { RequestDocumentService } from 'src/app/Shared/Services/request-document.service';
import { CreateRequestDocument, ListRequestDocumentVM } from 'src/app/Shared/Models/RequestDocumentVM';
import { environment } from 'src/environments/environment';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { RequestTrackingService } from 'src/app/Shared/Services/request-tracking.service';
import { CreateRequestTracking, EditRequestTracking, RequestDetails, RequestTrackingView } from 'src/app/Shared/Models/RequestTrackingVM';
import { IndexRequestStatus } from 'src/app/Shared/Models/RequestStatusVM';
import { RequestStatusService } from 'src/app/Shared/Services/request-status.service';
import { IndexProblemVM } from 'src/app/Shared/Models/ProblemVM';
import { IndexSubProblemVM } from 'src/app/Shared/Models/SubProblemVM';
import { IndexRequestTypeVM } from 'src/app/Shared/Models/ProjectTypeVM';
import { RequestTypeService } from 'src/app/Shared/Services/request-type.service';
import { ProblemService } from 'src/app/Shared/Services/problem.service';
import { SubProblemService } from 'src/app/Shared/Services/sub-problem.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UploadFilesService } from 'src/app/Shared/Services/uploadfilesservice';
import { MatStepper } from '@angular/material/stepper';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { Paging } from 'src/app/Shared/Models/paging';
import { HospitalService } from 'src/app/Shared/Services/hospital.service';
import { ListHospitalVM } from 'src/app/Shared/Models/hospitalVM';
import { FilterList } from '../create/create.component';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']

})
export class EditComponent implements OnInit {

  lang = localStorage.getItem("lang");
  currentUser: LoggedUser;
  // isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  statusFormGroup: FormGroup;
  reqObj: EditRequest;
  createRequestTrackingObj: CreateRequestTracking;
  editRequestTrackingObj: EditRequestTracking;
  createRequestDocument: CreateRequestDocument;
  requestDetailsObj: RequestDetails;

  lstMasterAsset: MasterAssetVM[] = [];
  lstassetDetails: AssetDetailVM[] = [];
  lstPeriorities: RequestPeriority[] = [];
  lstRequestMode: RequestModeVM[] = [];
  lstCreateRequestDocument: CreateRequestDocument[] = [];
  lstRequestStatus: IndexRequestStatus[] = [];
  lstProblems: IndexProblemVM[] = [];
  lstSubProblems: IndexSubProblemVM[] = [];
  lstRequestTypes: IndexRequestTypeVM[] = [];
  lstTracks: RequestTrackingView[] = [];
  lstDocuments: ListRequestDocumentVM[] = [];

  requestProblemId: number;
  requestTrackId: any;
  RequestTrackingId: number;
  requestId: number;
  isShowFiles: boolean = false;
  isDisabled: boolean = false;
  isDeleted: boolean = false;

  display: boolean = false;
  isAssetOwner: boolean = false;
  lstRoleNames: string[] = [];

 

  page: Paging;
  errorDisplay: boolean = false;
  errorMessage: string = "";
  srRFileName: string = "";
  statusId: number = 0;
  //File Upload 
  itmIndex: any[] = [];
  formData = new FormData();
  incremant: number = 0;
  lstHospitals:ListHospitalVM[] = [];
  selectedType: number=0;
  assetSerialObj:AssetDetailVM;
  assetBarCodeObj:AssetDetailVM;
  showBarcode:boolean=false;
  showSerial:boolean=false;
  showName:boolean=false;
  showDepartment:boolean=false;
  showStatus:boolean=false;
  lstTypes: FilterList[] = [];
  masterAssetObj1: any;
  radioPerioritySelected: number;
  lstRequests: ListRequestVM[] = [];
  count: number;
  SuccessfullyMessage:string='';
  showSuccessfullyMessage:boolean=false;
  brandName:string="";
  modelNumber:string="";
  serialNumber:string="";
  barCode:string="";
  departmentName:string="";
  assetStatusId:number=0;
  applicationStatus:string="";
  assetDepartmentBarCodeObj: AssetDetailVM;
  lstassetDetailBarcodes: AssetDetailVM[] = [];
  departmentId:number;

  constructor(private hospitalService:HospitalService,private authenticationService: AuthenticationService, private requestService: RequestService, private _formBuilder: FormBuilder,
    private assetDetailService: AssetDetailService, private masterAssetService: MasterAssetService, private requestPeriorityService: RequestPeriorityService,
    private requestModeService: RequestModeService, private requestDocumentService: RequestDocumentService, private requestTrackingService: RequestTrackingService,
    private config: DynamicDialogConfig, private ref: DynamicDialogRef, private uploadService: UploadFilesService, private messageService: MessageService, private httpClient: HttpClient, private requestStatusService: RequestStatusService,
    private requestTypeService: RequestTypeService, private problemService: ProblemService, private subProblemService: SubProblemService) { this.currentUser = this.authenticationService.currentUserValue; }


  ngOnInit(): void {
   
    console.log("id :",this.config.data.id);
    this.onLoad();
    this.requestId = this.config.data.id;
    this.requestService.GetRequestById(this.requestId).subscribe(
      res => {
        console.log("res :",res);
        console.log("res.hospitalId :",res.hospitalId);
        this.reqObj = res;
        this.selectedType=1;
        this.showBarcode = true;
        this.showSerial = false;
        this.showName = false;
        this.showDepartment = false;
        this.lstMasterAsset = [];
        this.assetSerialObj = null;
        this.masterAssetObj1 = null;
        this.assetBarCodeObj=new AssetDetailVM()
        this.showStatus=true;
        this.assetBarCodeObj.name =  this.reqObj.barcode;
        this.assetBarCodeObj.id =  this.reqObj.id;
        var assetId =  this.reqObj.assetDetailId;
         this.applicationStatus=this.lang=='en'?"Working":"يعمل"
        this.requestService.GetOldRequestsByHospitalAssetId(assetId).subscribe(items => {
          this.lstRequests = items;
          console.log("this.lstRequests :",this.lstRequests);
        });
        console.log("lang :",this.lang);
        console.log("this.assetBarCodeObj :",this.assetBarCodeObj);
        
        this.brandName = this.lang == 'en' ? this.assetBarCodeObj.brandName : this.assetBarCodeObj.brandNameAr;
        console.log(" this.brandName :", this.brandName );
        
        this.modelNumber = this.assetBarCodeObj.model;
        this.serialNumber = this.assetBarCodeObj.serialNumber;
        this.barCode = this.assetBarCodeObj.barcode;
        this.departmentName = this.lang == 'en' ? this.assetBarCodeObj["departmentName"] : this.assetBarCodeObj["departmentNameAr"];
    
        this.problemService.GetProblemByMasterAssetId(this.reqObj.masterAssetId).subscribe(problems => {
          this.lstProblems = problems;
          this.problemService.GetProblemBySubProblemId(this.reqObj.subProblemId).subscribe(problemObj => {

            if (problemObj[0] != null) {
              this.reqObj.problemId = problemObj[0]["id"];
            }
          });
        });

        this.requestTrackingService.GetTracksByRequestId(this.reqObj.id).subscribe(tracks => {
          this.lstTracks = tracks;
          if (this.lstTracks.length > 1) {
            this.isDisabled = true;
          }
          else {
            this.isDisabled = false;
          }
        });
        this.masterAssetService.ListMasterAssetsByHospitalUserId(this.currentUser.hospitalId, this.currentUser.id).subscribe(
          res => {
            this.lstMasterAsset = res;
            this.assetDetailService.GetAssetById(this.reqObj.assetDetailId).subscribe(item => {
              this.assetDetailService.ViewAllAssetDetailByMasterId(item.masterAssetId).subscribe(lstSerials => {
                this.lstassetDetails = lstSerials;
              });
              this.reqObj.masterAssetId = item.masterAssetId;
            });
          });
      });
  }
  close() {
    this.ref.close({ data: this.statusId });
  }
  
  onLoad() {

    this.lstTypes = [{ id: 1, name: "Select By Barcode", nameAr: "بحث بالباركود" },
      { id: 2, name: "Select By Serial", nameAr: "بحث بالسيريال" },
      { id: 3, name: "Select By Name", nameAr: "بحث بالإسم" },
      { id: 4, name: "Select By Department", nameAr: "بحث بالقسم" }]
    this.requestDetailsObj = {
      wONotes: '', departmentName: '', departmentNameAr: '',
      barcode: '', requestTypeName: '', subProblemName: '', modeName: '', periorityName: '', assetCode: '', hospitalId: 0,
      serialNumber: '', createdById: "", id: 0, requestCode: '', descriptionDate: new Date, lstTracking: [], requestId: 0, statusName: "", userName: "",
      subject: '', requestPeriorityId: 0, requestStatusId: 0, requestDate: new Date(), subProblemId: 0, description: '', requestModeId: 0, assetDetailId: 0, requestTypeId: 0,
      assetName: '', assetNameAr: '', modeNameAr: '', periorityNameAr: '', requestTypeNameAr: '', statusNameAr: '', subProblemNameAr: '', problemId: 0, problemName: '', problemNameAr: ''
    }
    this.reqObj = {
      createdBy: '', requestTypeName: '', subProblemName: '', modeName: '', periorityName: '',
      serialNumber: '', createdById: "", problemId: 0, masterAssetId: 0,
      id: 0, requestCode: '', requestTrackingId: 0, barcode: '',
      subject: '', requestPeriorityId: 0, requestStatusId: 0, assetCode: '',
      requestTime: new Date().getHours() + ':' + new Date().getMinutes(), requestDate: new Date(),
      subProblemId: 0, description: '', requestModeId: 0, assetDetailId: 0, requestTypeId: 0, hospitalId: 0
    }
    this.createRequestDocument = { id: 0, requestTrackingId: 0, fileName: '', documentName: '', requestFile: File, hospitalId: 0 }
    this.createRequestTrackingObj = { strDescriptionDate: '', id: 0, createdById: "", description: '', descriptionDate: new Date(), requestId: 0, requestStatusId: 0, hospitalId: 0 }

    this.editRequestTrackingObj = { createdById: '', description: '', descriptionDate: new Date, id: 0, requestId: 0, requestStatusId: 0, hospitalId: 0 }




    this.requestPeriorityService.GetAllRequestPeriorties().subscribe(
      res => {
        this.lstPeriorities = res
      });
    this.requestModeService.GetAllRequetsMode().subscribe(
      res => {
        this.lstRequestMode = res
        
      });


    this.requestTypeService.GetAllRequestTypes().subscribe(
      res => {
        this.lstRequestTypes = res
      });

    this.subProblemService.GetAllSubProblems().subscribe(
      res => {
        this.lstSubProblems = res
      });
      this.hospitalService.GetHospitals().subscribe(hospitals => {
        this.lstHospitals = hospitals;
      });

  }

  getDocuments(trackid: number) {
    this.requestDocumentService.GetRequestDocumentsByRequestTrackingId(trackid).subscribe(lstdocs => {
      this.lstDocuments = lstdocs;
    });
    this.isShowFiles = true;
  }
  addFiles(trackId: number, stepper: MatStepper) {
    stepper.next();
    this.requestTrackId = trackId;
    this.getDocuments(trackId);
    this.isShowFiles = true;
  }
  downloadFile(fileName) {
    var filePath = `${environment.Domain}UploadedAttachments/`;
    this.uploadService.downloadRequestTrackFile(fileName).subscribe(file => {
      var dwnldFile = filePath + 'RequestDocuments/' + fileName;
      if (fileName != "" || fileName != null)
        window.open(dwnldFile);
    })
  }
  getSelecteditem() {
    this.reqObj.requestPeriorityId = Number(this.radioPerioritySelected);
  }
  GetAllSubProblemsByProblemId($event) {
    this.subProblemService.GetAllSubProblemsByProblemId($event.target.value).subscribe(
      res => {
        this.lstSubProblems = res
      }
    )
  }
  ViewAllAssetDetailByMasterId($event) {
    this.assetDetailService.ViewAllAssetDetailByMasterId($event.target.value).subscribe(
      res => {
        this.lstassetDetails = res
      });
    this.problemService.GetProblemByMasterAssetId($event.target.value).subscribe(problems => this.lstProblems = problems)
  }
  getAssetCode($event) {
    this.assetDetailService.GetAssetById($event.target.value).subscribe(assetObj => {
      this.reqObj.assetCode = assetObj["code"];
    })
  }
  getBarCode(assetBarCodeObj:any) {
    this.showStatus=true;
    this.assetBarCodeObj.barCode = assetBarCodeObj["barCode"];
    this.assetBarCodeObj.id = assetBarCodeObj["id"];
    var assetId = assetBarCodeObj["id"];
    console.log("assetId :",assetId);
    this.requestService.GetOldRequestsByHospitalAssetId(assetId).subscribe(items => {
      this.lstRequests = items;
      console.log("this.lstRequests :",this.lstRequests);
    });
    
    this.brandName = this.lang == 'en' ? assetBarCodeObj["brandName"] : assetBarCodeObj["brandNameAr"];
    this.modelNumber = assetBarCodeObj["model"];
    this.serialNumber = assetBarCodeObj["serialNumber"];
    this.barCode = assetBarCodeObj["barCode"];
    this.departmentName = this.lang == 'en' ? assetBarCodeObj["departmentName"] : assetBarCodeObj["departmentNameAr"];

    if (this.currentUser.hospitalId != 0) {
      this.assetDetailService.GetAssetNameByMasterAssetIdAndHospitalId(Number(assetBarCodeObj["masterAssetId"]), this.currentUser.hospitalId).subscribe(
        res => {
          this.lstassetDetails = res;
          this.reqObj.assetDetailId = assetBarCodeObj["id"];
          this.reqObj.masterAssetId = assetBarCodeObj["masterAssetId"];
          this.lstRequests = [];
          this.assetDetailService.GetHospitalAssetById(this.reqObj.assetDetailId).subscribe(assetObj => {
            this.assetBarCodeObj = assetObj;
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

            this.applicationStatus = this.lang == "en" ? this.assetBarCodeObj["assetStatus"] : this.assetBarCodeObj["assetStatusAr"];
            this.assetBarCodeObj.name = assetObj["barcode"];
            this.assetStatusId = this.assetBarCodeObj["assetStatusId"];

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
      this.assetDetailService.GetAssetNameByMasterAssetIdAndHospitalId(Number(assetBarCodeObj["masterAssetId"]), this.reqObj.hospitalId).subscribe(
        res => {
          this.lstassetDetails = res;
          this.reqObj.assetDetailId = assetBarCodeObj["id"];
          this.reqObj.masterAssetId = assetBarCodeObj["masterAssetId"];
          this.lstRequests = [];
          this.assetDetailService.GetHospitalAssetById(this.reqObj.assetDetailId).subscribe(assetObj => {
            this.assetBarCodeObj = assetObj;

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
            else if (this.assetBarCodeObj["assetStatusAr"] != null && this.assetBarCodeObj["assetStatus"] != null){
              this.applicationStatus = this.lang == "en" ? this.assetBarCodeObj["assetStatus"] : this.assetBarCodeObj["assetStatusAr"];
              this.assetBarCodeObj.name = assetObj["barcode"];
              this.assetStatusId = this.assetBarCodeObj["assetStatusId"];

              var isWorking = this.findAssetStatusByStatusId(this.assetStatusId);
              if (this.assetStatusId == 3) {
                isWorking = true;
                this.isDisabled = false;
              }
              else
              {
                return false;
              }
            }
          });
        });
    }
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
  EditRequest() {

    var validStatus=this.findAssetStatusByStatusId(this.assetStatusId);
    if(!validStatus)
    {
      return;
    }
    if (this.currentUser.hospitalId!=0) {
      if (this.reqObj.hospitalId == 0) {
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "Please select hospital";
        }
        else {
          this.errorMessage = "من فضلك اختر مستشفى ";
        }
        return false;
      }
    }
    if (this.selectedType == 1) {
      if (this.assetBarCodeObj == undefined) {
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "Please select asset barcode";
        }
        else {
          this.errorMessage = "من فضلك اختر باركود الجهاز";
        }
        return false;
      }
      if (this.reqObj.assetDetailId == 0) {
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
        this.reqObj.assetDetailId = this.assetBarCodeObj.id;
      }
    }
    if (this.selectedType == 2) {
      if (this.assetSerialObj == undefined) {
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "Please select asset serial";
        }
        else {
          this.errorMessage = "من فضلك اختر سيريال الجهاز";
        }
        return false;
      }
      if (this.reqObj.assetDetailId == 0) {
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
        this.reqObj.assetDetailId = this.assetSerialObj.id;
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
      if (this.reqObj.assetDetailId == 0) {
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
    this.reqObj.hospitalId = this.currentUser.hospitalId;
    this.requestService.updateRequest(this.reqObj).subscribe(res => { });
    this.requestTrackingService.GetFirstTrackForRequestByRequestId(this.reqObj.id).subscribe(trackObj => {
      this.requestTrackingService.GetById(trackObj.id).subscribe(trkObj => {
        trkObj.id = trackObj.id;
        trkObj.requestStatusId = Number(trackObj.statusId);
        trkObj.description = this.reqObj.description;
        trkObj.hospitalId = this.currentUser.hospitalId;
        this.requestTrackingService.updateRequestTrack(trkObj).subscribe(updated => {


          if (this.lstCreateRequestDocument.length > 0) {
            this.lstCreateRequestDocument.forEach((elemnt, index) => {
              elemnt.hospitalId = this.currentUser.hospitalId;
              elemnt.requestTrackingId = Number(trkObj.id);
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
            this.ref.close(this.page);
          }
          else {
            this.display = true;
            this.ref.close(this.page);
          }
        });
      });
    });
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
    }
    this.addMultiFilesToList();
  }
  onSelectionChanged(event) {
    this.isDisabled = false;
    var hospitalId=this.currentUser.hospitalId != 0? this.currentUser.hospitalId:this.reqObj.hospitalId
      this.assetDetailService.AutoCompleteAssetBarCode(event.query, hospitalId).subscribe(assets => {
        this.lstassetDetailBarcodes = assets;
        if (this.lang == "en") {
          this.lstassetDetailBarcodes.forEach(item => item.name = item.barCode);
        }
        else {
          this.lstassetDetailBarcodes.forEach(item => item.name = item.barCode);
        }
      });
  }
  onTypeChange($event) {
    console.log("event:",$event)
    let typeId = $event.value;
    this.showStatus=false;
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
  addMultiFilesToList() {
    this.createRequestDocument.requestTrackingId = this.requestTrackId;
    this.lstCreateRequestDocument.forEach((requestDocumentObj, index) => {
      requestDocumentObj.requestTrackingId = Number(this.requestTrackId);
      let ext = requestDocumentObj.fileName.split('.').pop();
      let lastdocumentName = "";
      let imageIndex = "";
      if (this.itmIndex.length == 0) {
        this.requestDocumentService.GetLastDocumentForRequestTrackingId(Number(this.requestTrackId)).subscribe(lastDoc => {
          lastdocumentName = lastDoc.fileName;
          if (lastdocumentName == null) {

            if (this.itmIndex.length == 0) {
              var last_element = 1;
              this.itmIndex.push(last_element);
              let ext = requestDocumentObj.fileName.split('.').pop();
              var hCode = this.pad(this.currentUser.hospitalCode, 4);
              var srCode = this.pad(this.reqObj.requestCode, 10);
              let newIndex = this.pad((last_element).toString(), 2);
              let newFileName = hCode + "SR" + srCode + newIndex;
              requestDocumentObj.fileName = newFileName + "." + ext;
            }
            else {
              var lastIndex2 = this.itmIndex[this.itmIndex.length - 1];
              last_element = lastIndex2 + 1;
              this.itmIndex.push(last_element);
              var hCode = this.pad(this.currentUser.hospitalCode, 4);
              var srCode = this.pad(this.reqObj.requestCode, 10);
              let newIndex = this.pad((last_element).toString(), 2);
              let SRFileName = hCode + "SR" + srCode + newIndex;
              requestDocumentObj.fileName = SRFileName + "." + ext;
            }
          }
          else if (lastdocumentName != "") {
            if (this.itmIndex.length == 0) {
              lastdocumentName = lastdocumentName.substring(0, lastdocumentName.lastIndexOf("."));
              var lastIndex = Number(lastdocumentName.slice(-2)) + 1;
              var hCode = this.pad(this.currentUser.hospitalCode, 4);
              var srCode = this.pad(this.reqObj.requestCode, 10);
              let newIndex = this.pad((lastIndex).toString(), 2);
              let woRFileName = hCode + "SR" + srCode + newIndex + "." + ext;
              requestDocumentObj.fileName = woRFileName;
              this.itmIndex.push(lastIndex);
            }
            else {
              var lastIndex2 = this.itmIndex[this.itmIndex.length - 1];
              last_element = lastIndex2 + 1;
              this.itmIndex.push(last_element);
              var hCode = this.pad(this.currentUser.hospitalCode, 4);
              var srCode = this.pad(this.reqObj.requestCode, 10);
              let newIndex = this.pad((last_element).toString(), 2);
              let SRFileName = hCode + "SR" + srCode + newIndex;
              requestDocumentObj.fileName = SRFileName + "." + ext;
            }
          }
          else if (lastdocumentName == "") {
            if (this.itmIndex.length == 0) {
              var last_element = 1;
              this.itmIndex.push(last_element);
              let ext = requestDocumentObj.fileName.split('.').pop();
              var hCode = this.pad(this.currentUser.hospitalCode, 4);
              var srCode = this.pad(this.reqObj.requestCode, 10);
              let newIndex = this.pad((last_element).toString(), 2);
              let WOFileName = hCode + "SR" + srCode + newIndex;
              requestDocumentObj.fileName = WOFileName + "." + ext;
            }
            else {
              var lastIndex2 = this.itmIndex[this.itmIndex.length - 1];
              last_element = lastIndex2 + 1;
              this.itmIndex.push(last_element);
              var hCode = this.pad(this.currentUser.hospitalCode, 4);
              var srCode = this.pad(this.reqObj.requestCode, 10);
              let newIndex = this.pad((last_element).toString(), 2);
              let SRFileName = hCode + "SR" + srCode + newIndex;
              requestDocumentObj.fileName = SRFileName + "." + ext;
            }
          }
          requestDocumentObj = { id: 0, fileName: '', requestTrackingId: 0, documentName: '', requestFile: File, hospitalId: 0 };
        });
      }
      else if (this.itmIndex.length > 0) {
        var last_element = this.itmIndex[this.itmIndex.length - 1];
        last_element = parseInt(last_element) + (++this.incremant);
        this.itmIndex.push(last_element);

        var hCode = this.pad(this.currentUser.hospitalCode, 4);
        var srCode = this.pad(this.reqObj.requestCode, 10);
        let newIndex = this.pad((last_element).toString(), 2);
        let SRFileName = hCode + "SR" + srCode + newIndex;
        requestDocumentObj.fileName = SRFileName + "." + ext;
        requestDocumentObj = { id: 0, fileName: '', requestTrackingId: 0, documentName: '', requestFile: File, hospitalId: 0 };
      }
    });
  }
  pad(num: string, size: number): string {
    while (num.length < size) num = "0" + num;
    return num;
  }
  removeFileFromObjectArray(rowIndex) {
    if (rowIndex >= 0 && rowIndex < this.lstCreateRequestDocument.length) {
      this.lstCreateRequestDocument.splice(rowIndex, 1);
      this.itmIndex = [];
      this.lstCreateRequestDocument.forEach((requestDocumentObj, index) => {
        requestDocumentObj.requestTrackingId = Number(this.requestTrackId);
        let ext = requestDocumentObj.fileName.split('.').pop();
        let lastdocumentName = "";
        let imageIndex = "";
        if (this.itmIndex.length == 0) {
          this.requestDocumentService.GetLastDocumentForRequestTrackingId(Number(this.requestTrackId)).subscribe(lastDoc => {
            lastdocumentName = lastDoc.fileName;
            if (lastdocumentName == null) {

              if (this.itmIndex.length == 0) {
                var last_element = 1;
                this.itmIndex.push(last_element);
                let ext = requestDocumentObj.fileName.split('.').pop();
                var hCode = this.pad(this.currentUser.hospitalCode, 4);
                var srCode = this.pad(this.reqObj.requestCode, 10);
                let newIndex = this.pad((last_element).toString(), 2);
                let newFileName = hCode + "SR" + srCode + newIndex;
                requestDocumentObj.fileName = newFileName + "." + ext;
              }
              else {
                var lastIndex2 = this.itmIndex[this.itmIndex.length - 1];
                last_element = lastIndex2 + 1;
                this.itmIndex.push(last_element);
                var hCode = this.pad(this.currentUser.hospitalCode, 4);
                var srCode = this.pad(this.reqObj.requestCode, 10);
                let newIndex = this.pad((last_element).toString(), 2);
                let SRFileName = hCode + "SR" + srCode + newIndex;
                requestDocumentObj.fileName = SRFileName + "." + ext;
              }
            }
            else if (lastdocumentName != "") {
              if (this.itmIndex.length == 0) {
                lastdocumentName = lastdocumentName.substring(0, lastdocumentName.lastIndexOf("."));
                var lastIndex = Number(lastdocumentName.slice(-2)) + 1;
                var hCode = this.pad(this.currentUser.hospitalCode, 4);
                var srCode = this.pad(this.reqObj.requestCode, 10);
                let newIndex = this.pad((lastIndex).toString(), 2);
                let woRFileName = hCode + "SR" + srCode + newIndex + "." + ext;
                requestDocumentObj.fileName = woRFileName;
                this.itmIndex.push(lastIndex);
              }
              else {
                var lastIndex2 = this.itmIndex[this.itmIndex.length - 1];
                last_element = lastIndex2 + 1;
                this.itmIndex.push(last_element);
                var hCode = this.pad(this.currentUser.hospitalCode, 4);
                var srCode = this.pad(this.reqObj.requestCode, 10);
                let newIndex = this.pad((last_element).toString(), 2);
                let SRFileName = hCode + "SR" + srCode + newIndex;
                requestDocumentObj.fileName = SRFileName + "." + ext;
              }
            }
            else if (lastdocumentName == "") {
              if (this.itmIndex.length == 0) {
                var last_element = 1;
                this.itmIndex.push(last_element);
                let ext = requestDocumentObj.fileName.split('.').pop();
                var hCode = this.pad(this.currentUser.hospitalCode, 4);
                var srCode = this.pad(this.reqObj.requestCode, 10);
                let newIndex = this.pad((last_element).toString(), 2);
                let WOFileName = hCode + "SR" + srCode + newIndex;
                requestDocumentObj.fileName = WOFileName + "." + ext;
              }
              else {
                var lastIndex2 = this.itmIndex[this.itmIndex.length - 1];
                last_element = lastIndex2 + 1;
                this.itmIndex.push(last_element);
                var hCode = this.pad(this.currentUser.hospitalCode, 4);
                var srCode = this.pad(this.reqObj.requestCode, 10);
                let newIndex = this.pad((last_element).toString(), 2);
                let SRFileName = hCode + "SR" + srCode + newIndex;
                requestDocumentObj.fileName = SRFileName + "." + ext;
              }
            }
            requestDocumentObj = { id: 0, fileName: '', requestTrackingId: 0, documentName: '', requestFile: File, hospitalId: 0 };
          });
        }
        else if (this.itmIndex.length > 0) {
          var last_element = this.itmIndex[this.itmIndex.length - 1];
          last_element = parseInt(last_element) + (++this.incremant);
          this.itmIndex.push(last_element);
          var hCode = this.pad(this.currentUser.hospitalCode, 4);
          var srCode = this.pad(this.reqObj.requestCode, 10);
          let newIndex = this.pad((last_element).toString(), 2);
          let SRFileName = hCode + "SR" + srCode + newIndex;
          requestDocumentObj.fileName = SRFileName + "." + ext;
          requestDocumentObj = { id: 0, fileName: '', requestTrackingId: 0, documentName: '', requestFile: File, hospitalId: 0 };
        }
      });

    }
  }
  deleteFile(id: number) {
    this.requestService.DeleteRequestDocument(id).subscribe(deletedfile => {
      this.isDeleted = true;
    });
  }



}
