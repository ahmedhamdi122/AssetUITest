import { Component, ElementRef, OnInit, ViewChild, viewChild } from '@angular/core';
import { ListOriginVM } from 'src/app/Shared/Models/originVM';
import { ListSubCategoryVM } from 'src/app/Shared/Models/subCategoryVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { AssetPeriorityService } from 'src/app/Shared/Services/assetperiority.service';
import { BrandService } from 'src/app/Shared/Services/brand.service';
import { CategoryService } from 'src/app/Shared/Services/category.service';
import { MasterAssetService } from 'src/app/Shared/Services/masterAsset.service';
import { OriginService } from 'src/app/Shared/Services/origin.service';
import { SubCategoryService } from 'src/app/Shared/Services/subcategory.service';
import { UploadFilesService } from 'src/app/Shared/Services/uploadfilesservice';
import { Observable } from 'rxjs';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CreateMasterAssetAttachmentVM, CreatePMAssetTaskVM, EditMasterAssetVM, ListPMAssetTaskVM, MasterAssetAttachmentVM } from 'src/app/Shared/Models/masterAssetVM';
import { ListCategoryVM } from 'src/app/Shared/Models/categoryVM';
import { ListBrandVM } from 'src/app/Shared/Models/brandVM';
import { ListAssetPeriorityVM } from 'src/app/Shared/Models/assetPeriorityVM';
import { FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { ConfirmationService } from 'primeng/api';
import { ECRIService } from 'src/app/Shared/Services/ecri.service';
import { ListECRIVM } from 'src/app/Shared/Models/ecriVM';
import { ListPMTimeVM } from 'src/app/Shared/Models/pmTimeVM';
import { CreateAssetWorkOrderTaskVM, IndexAssetWorkOrderTaskVM } from 'src/app/Shared/Models/AssetWorkOrderTaskVM';
import { AssetWorkOrderTaskService } from 'src/app/Shared/Services/asset-work-order-task.service';
import { CreateMasterAssetComponentVM, ListMasterAssetComponentVM } from 'src/app/Shared/Models/masterAssetComponentVM';
import { MasterAssetComponentService } from 'src/app/Shared/Services/masterAssetComponent.service';
import { Router } from '@angular/router';
import { ListCategoryTypeVM } from 'src/app/Shared/Models/categoryTypeVM';
import { CategoryTypeService } from 'src/app/Shared/Services/categoryType.service';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { CreateBrandComponent } from '../../brands/create-brand/create-brand.component';
import { PMTimeService } from 'src/app/Shared/Services/pmtime.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit {
  currentUser: LoggedUser;
  public lang = localStorage.getItem('lang');
  textDir: string = 'ltr';
  form: FormGroup;
  masterAssetObj: EditMasterAssetVM;
  lstTypes: ListCategoryTypeVM[] = [];
  lstCategories: ListCategoryVM[] = [];
  lstSubCategories: ListSubCategoryVM[] = [];
  lstBrands: ListBrandVM[] = [];
  lstOrigins: ListOriginVM[] = [];
  lstPeriorities: ListAssetPeriorityVM[] = [];
  lstECRIs: ListECRIVM[] = [];
  SavedlstPMTaskItems: ListPMAssetTaskVM[] = [];
  pmTaskObj: CreatePMAssetTaskVM;
  CreatelstPMTasks: CreatePMAssetTaskVM[] = [];
  lstTasks: CreatePMAssetTaskVM[] = [];
  lstWOTaskItems: IndexAssetWorkOrderTaskVM[] = [];
  woTaskObj: CreateAssetWorkOrderTaskVM;
  lstWOTasks: CreateAssetWorkOrderTaskVM[] = [];
  lstAddWOTasks: CreateAssetWorkOrderTaskVM[] = [];
  lstPMTimes: ListPMTimeVM[] = [];
  radioPerioritySelected: number;
  selectedPMTime: any;
  errorMessage: string;
  errorDisplay: boolean = false;
  display: boolean = false;
  masterAssetId: number;
  selectedFiles: FileList;
  progressInfos = [];
  message = '';
  abbr: any;
  fname = '';
  fileInfos: Observable<any>;
  masterId: number;
  lstAttachment: MasterAssetAttachmentVM[] = [];
  masterAssetDocument: CreateMasterAssetAttachmentVM;
  lstMasterAssetDocuments: CreateMasterAssetAttachmentVM[] = [];
  createTask: CreatePMAssetTaskVM;
  fileName = '';
  imgURL: string = "";
  itmIndex: any[] = [];
  formData = new FormData();
  public file: File;
  compObj: CreateMasterAssetComponentVM;
  CreateMasterAssetComponentVM: CreateMasterAssetComponentVM[] = [];
  lstSavedComponents: ListMasterAssetComponentVM[] = [];
  canAddBrand: boolean = false;
  isAdmin: boolean = false;
  isHospitalManager: boolean = false;
  lstRoleNames: string[] = [];
  uploadFileName: string;
  fileToUpload: File;
  incremant: number = 0;
  isInvalidBrand=false;
  imgVisible=true;
  btnHidden: boolean = true;
  @ViewChild('fileUpload',{static:false})
  upfile: ElementRef;
  imagePath: any = "";
  deletedSuccessfullyDisplay:boolean=false;
  showSuccessfullyMessage:boolean=false;
  SuccessfullyHeader:string='';
  SuccessfullyMessage:string='';
  constructor(
    private authenticationService: AuthenticationService, private masterAssetService: MasterAssetService, private masterAssetComponentService: MasterAssetComponentService, private uploadService: UploadFilesService, private categoryTypeService: CategoryTypeService, private categoryService: CategoryService, private subCategoryService: SubCategoryService, private originService: OriginService, private brandService: BrandService, private ecriService: ECRIService, private assetPeriorityService: AssetPeriorityService,
    private pmTimeService: PMTimeService, private config: DynamicDialogConfig, private ref: DynamicDialogRef, private assetWorkOrderTaskService: AssetWorkOrderTaskService,
    private confirmationService: ConfirmationService, private dialogService: DialogService, private route: Router,private spinner:NgxSpinnerService
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
  }
  ngOnInit(): void {
    if (this.lang == 'en') {
      this.textDir = 'ltr';
    } else if (this.lang == 'ar') {
      this.textDir = 'rtl';
    }
 
    this.masterAssetDocument = {
      fileName: '', masterAssetId: 0, title: '', masterFile: File
    };
    this.pmTaskObj = { tasknameAr: '', taskname: '', masterAssetId: 0 }
    this.woTaskObj = { name: '', nameAr: '', code: '', masterAssetId: 0, id: 0 }
    this.compObj = { compCode: '', compName: '', compNameAr: '', partNo: "", price: 0, masterAssetId: 0, compDescription: '', compDescriptionAr: '' }
    this.masterAssetObj = {
      ecriId: 0, id: 0, brandId: 0, categoryId: 0, expectedLifeTime: 0, height: 0, length: 0, originId: 0, periorityId: 0, subCategoryId: 0, weight: 0, width: 0, brandName: '', brandNameAr: '', model: '',
      code: '', description: '', descriptionAr: '', modelNumber: '', name: '', nameAr: '', versionNumber: '', title: '', power: '', voltage: '', ampair: '', frequency: '', electricRequirement: '', pmTimeId: 0, assetImg: ''
    };

    this.createTask = { taskname: '', tasknameAr: '', masterAssetId: 0 };
    this.onLoad();
    
    let id = this.config.data.id;

    this.masterId = id;
    this.masterAssetService.GetMasterAssetById(id).subscribe((data) => {
      this.masterAssetObj = data;
      this.masterAssetId = this.masterAssetObj.id;
      console.log(" this.masterAssetObj :", this.masterAssetObj);
      
      if (this.masterAssetObj.assetImg == null) {
        this.imgURL = `${environment.Domain}UploadedAttachments/MasterAssets/UploadMasterAssetImage/UnknownAsset.png`;
      }
      else if (this.masterAssetObj.assetImg == "") {
        this.imgURL = `${environment.Domain}UploadedAttachments/MasterAssets/UploadMasterAssetImage/UnknownAsset.png`;
      }
      else {
        this.imgURL = `${environment.Domain}UploadedAttachments/MasterAssets/UploadMasterAssetImage/` + data["assetImg"];
      }
      this.selectedPMTime = Number(data['pmTimeId']);
      this.radioPerioritySelected = this.masterAssetObj.periorityId;//.toString();
      if (this.masterAssetObj.categoryId != null) {
        this.subCategoryService
          .GetSubCategoriesByCategoryId(this.masterAssetObj.categoryId)
          .subscribe((subs) => {
            this.lstSubCategories = subs;
          });
        this.categoryService.GetCategoryById(this.masterAssetObj.categoryId).subscribe(categoryObj => {
          this.masterAssetObj.categoryTypeId = categoryObj["categoryTypeId"]
        })
      }
      console.log("this.masterId :",this.masterId);
      this.masterAssetService.GetAttachmentByMasterAssetId(this.masterId)
        .subscribe(
          (files) => {
            this.lstAttachment = files;
            console.log("lstAttachment :",this.lstAttachment);
            
          },
          (error) => console.log(error)
        );

      this.masterAssetService
        .GetPMAssetTaskByMasterAssetId(id)
        .subscribe((tasks) => {
          this.SavedlstPMTaskItems = tasks;
          console.log("this.lstPMTaskItems :",this.SavedlstPMTaskItems);
        });
      this.masterAssetComponentService.ListMasterAssetComponentsByMasterAssetId(this.masterId)
        .subscribe((components) => {
          this.lstSavedComponents = components;
          console.log("this.lstSavedComponents :",this.lstSavedComponents);

        });


    });
  }
  onLoad() {
    this.categoryService.GetCategories().subscribe((categories) => {
      this.lstCategories = categories;
    });

    this.originService.GetOrigins().subscribe((origins) => {
      this.lstOrigins = origins;
    });

    this.assetPeriorityService
      .GetAssetPeriorities()
      .subscribe((periorities) => {
        this.lstPeriorities = periorities;
      });
    this.brandService.GetBrands().subscribe((brands) => {
      this.lstBrands = brands;
    });
    this.ecriService.GetECRIS().subscribe((ecris) => {
      this.lstECRIs = ecris;
    });
    this.pmTimeService.GetPMTimes().subscribe((pmtimes) => {
      this.lstPMTimes = pmtimes;
    });
    this.categoryTypeService.GetCategoryTypes().subscribe(types => { this.lstTypes = types })
  }
  GetCategoriesByCategoryTypeId($event) {
    this.categoryService.GetCategoryByCategoryTypeId($event.target.value).subscribe(categories => { this.lstCategories = categories })
  }
  onFileSelected(event) {
    console.log("event :",event.target.files)
    this.file = event.target.files[0];
    if (this.file) {
      var reader = new FileReader();
      reader.readAsDataURL(this.file);
      reader.onload = (event) => {
        this.imagePath = event.target.result;
        this.imgVisible = false;
        this.btnHidden = false;
        console.log("imagePath :",this.imagePath)
      }
    }
  }
  deleteFile(id: number) {
    this.spinner.show();
    this.masterAssetService.DeleteMasterAssetImage(id).subscribe((saved) => {
      this.spinner.show();
      this.display = true;
    });
  }
  getSelecteditem() {
    this.masterAssetObj.periorityId = Number(this.radioPerioritySelected);
  }
  GetSubCategoryByCategoryId($event) {
    this.subCategoryService
      .GetSubCategoriesByCategoryId($event.target.value)
      .subscribe((subs) => {
        this.lstSubCategories = subs;
      });
  }
  resetFile() {
    console.log("upfile.nativeElement",this.upfile )
    this.upfile.nativeElement.value = "";
    this.imgVisible = true;
    this.btnHidden = true;
  }
  onTimeChange($event) {
    this.selectedPMTime = $event.value;
  }
  deleteWOTask(id: number) {
    this.lstWOTasks.forEach((element) => {
      if (element.id == id) {
        if (this.lang == 'en') {
          this.confirmationService.confirm({
            message:
              'Are you sure that you want to delete this item ' +
              element['name'] +
              ' ?',
            header: 'Delete Item Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
              this.assetWorkOrderTaskService.DeleteAssetWorkOrderTask(id).subscribe(taskObj => {

                this.assetWorkOrderTaskService
                  .GetAllAssetWorkOrderTasksByMasterAssetId(this.masterId)
                  .subscribe((tasks) => {
                    this.lstWOTasks = tasks;
                  });
              })

            },
            reject: () => {
              this.confirmationService.close();
              this.ngOnInit();
            },
          });
        }

        if (this.lang == 'ar') {
          this.confirmationService.confirm({
            message:
              'هل أنت متأكد من مسح هذا العنصر ' +
              element['nameAr'] +
              ' ?',
            header: 'تأكيد المسح',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
              this.assetWorkOrderTaskService.DeleteAssetWorkOrderTask(id).subscribe(taskObj => {
                this.assetWorkOrderTaskService
                  .GetAllAssetWorkOrderTasksByMasterAssetId(this.masterId)
                  .subscribe((tasks) => {
                    this.lstWOTasks = tasks;
                  });
              })

            },
            reject: () => {
              this.confirmationService.close();
              this.ngOnInit();
            },
          });
        }
      }
    });
  }
  deleteTask(id: number) {
   
  }
  onSubmit() {

    this.masterAssetObj.pmTimeId = this.selectedPMTime;
    if (this.file) {
      let ext = this.file.name.split('.').pop();
      var hCode = this.pad(this.currentUser.hospitalCode, 4);
      var srCode = this.pad(this.masterAssetObj.code, 10);
      let newIndex = this.pad((this.masterAssetObj.id).toString(), 2);
      let HospitalAssetFileName = hCode + "MA" + srCode + newIndex;
      let masterFileName = HospitalAssetFileName + "." + ext;
    }
    else {
      this.masterAssetObj.assetImg = this.masterAssetObj.assetImg;
    }
    this.spinner.show();
    this.masterAssetService.UpdateMasterAsset(this.masterAssetObj).subscribe(assetObj => {
      if (this.file) {
        let ext = this.file.name.split('.').pop();
        var hCode = this.pad(this.currentUser.hospitalCode, 4);
        var srCode = this.pad(this.masterAssetObj.code, 10);
        let newIndex = this.pad((this.masterAssetObj.id).toString(), 2);
        let HospitalAssetFileName = hCode + "MA" + srCode + newIndex;
        let masterFileName = HospitalAssetFileName + "." + ext;
        this.masterAssetObj.assetImg = masterFileName;

        this.uploadService
          .uploadMasterAssetImage(this.file, masterFileName)
          .subscribe(
            (event) => { },
            (err) => {
              this.message = 'Could not upload the file:' + masterFileName;
            });
      }

      if (this.lstMasterAssetDocuments.length > 0) {
        this.lstMasterAssetDocuments.forEach((elemnt, index) => {
          elemnt.masterAssetId = this.masterAssetId;
          this.masterAssetService.CreateMasterAssetAttachments(elemnt).subscribe(lstfiles => {
            this.uploadService.uploadMasterAssetFiles(elemnt.masterFile, elemnt.fileName).subscribe(
              (event) => {
               
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
        this.lstMasterAssetDocuments = [];
      }
     
      if (this.CreateMasterAssetComponentVM.length > 0) {
        this.CreateMasterAssetComponentVM.forEach((elemnt) => {
          elemnt.masterAssetId = this.masterAssetObj.id;

          this.masterAssetComponentService.CreateMasterAssetComponent(elemnt)
            .subscribe(() => {
            }, error => {
              this.errorDisplay = true;
              if (this.lang == "en") {
                if (error.error.status == 'code') {
                  this.errorMessage = error.error.message;
                }
              }
              else {
                if (error.error.status == 'code') {
                  this.errorMessage = error.error.messageAr;
                }
              }
              return false;
            });
        });
      }
      if (this.CreatelstPMTasks.length > 0) {
        this.CreatelstPMTasks.forEach((elemnt) => {
          elemnt.masterAssetId = this.masterAssetId;
          this.masterAssetService.AddPMAssetTask(elemnt)
            .subscribe(() => {
            });
        });
      }
      this.ref.close("edit");

    },
      (error) => {
        this.errorDisplay = true;
        if (this.lang == 'en') {
          if (error.error.status == 'code') {
            this.errorMessage = error.error.message;
          }
          if (error.error.status == 'name') {
            this.errorMessage = error.error.message;
          }

          if (error.error.status == 'nameAr') {
            this.errorMessage = error.error.message;
          }
        }
        if (this.lang == 'ar') {
          if (error.error.status == 'code') {
            this.errorMessage = error.error.messageAr;
          }
          if (error.error.status == 'name') {
            this.errorMessage = error.error.messageAr;
          }

          if (error.error.status == 'nameAr') {
            this.errorMessage = error.error.messageAr;
          }
        }
        return false;
      }
    );
  }
  DeletePreventiveMaintenance(id:number,rowIndex:number)
  {
    this.confirmationService.confirm({
      header:`${this.lang == 'en' ? 'Delete Confirmation':'تأكيد المسح'}`,
     message: `${this.lang == 'en' ? `Are you sure that you want to delete this Preventive Maintenance?` : `هل أنت متأكد أنك تريد حذف هذه الصيانة الوقائية؟`}`,
     rejectButtonStyleClass:"p-button-text style='margin:0 15'",
     rejectLabel: this.lang === 'en' ? 'No' : 'لا', 
     acceptLabel: this.lang === 'en' ? 'Yes' : 'نعم',
     acceptIcon:"none",
     rejectIcon:"none",
     accept: ()=>{
       this.confirmationService.close();
       this.spinner.show();
      this.masterAssetService.DeletePMAssetTask(id).subscribe(
        deleted => {
          this.SavedlstPMTaskItems.splice(rowIndex,1);
          this.spinner.hide();
          this.showSuccessfullyMessage=true;
          if(this.lang=="en"){
            this.SuccessfullyMessage="Preventive Maintenance record deleted successfully";
            this.SuccessfullyHeader="Delete" 
        }
        else
        {
          this.SuccessfullyMessage="تم حذف مهمة الصيانة الوقائية بنجاح";
          this.SuccessfullyHeader="مسح" 
        }
      (error)=>{
                  this.errorDisplay=true;
                  if(this.lang=="en")
                  {this.errorMessage="An error occurred while deleting the file"}
                  else
                  {this.errorMessage="حدث خطأ أثناء حذف الملف."}
    }})},
  reject:()=>{
    this.confirmationService.close();
  }})
  }
DeleteAssetComponent(assetCompoenet:any,rowIndex:number)
{
  console.log("assetCompoenet :",assetCompoenet);
  
  this.confirmationService.confirm({
    header:`${this.lang == 'en' ? 'Delete Confirmation':'تأكيد المسح'}`,
   message: `${this.lang == 'en' ? `Are you sure that you want to delete ${assetCompoenet.name}?` : `هل انت متأكد انك تريد حذف ${assetCompoenet.nameAr}`}`,
   rejectButtonStyleClass:"p-button-text style='margin:0 15'",
   rejectLabel: this.lang === 'en' ? 'No' : 'لا', 
   acceptLabel: this.lang === 'en' ? 'Yes' : 'نعم',
   acceptIcon:"none",
   rejectIcon:"none",
   accept: ()=>{
     this.confirmationService.close();
     this.spinner.show();
     this.masterAssetComponentService.DeleteMasterAssetComponent(assetCompoenet.id).subscribe(
      deletedObj => {
      this.lstSavedComponents.splice(rowIndex,1);
      this.spinner.hide();
      this.showSuccessfullyMessage=true;
      if(this.lang=="en"){
        this.SuccessfullyMessage="Asset Component eleted successfully";
        this.SuccessfullyHeader="Delete" 
    }
    else
    {
      this.SuccessfullyMessage="تم حذف مكون الأصل بنجاح"
      this.SuccessfullyHeader="مسح" 
    }
   },
   (error)=>{
    this.errorDisplay=true;
    if(this.lang=="en")
    {this.errorMessage="An error occurred while deleting the file"}
    else
    {this.errorMessage="حدث خطأ أثناء حذف الملف."}
})},
reject:()=>{
  this.confirmationService.close();
}})
}
  DeleteFile(masterAssetDocument: any,rowIndex:number) {

    
    this.confirmationService.confirm({
      header:`${this.lang == 'en' ? 'Delete Confirmation':'تأكيد المسح'}`,
     message: `${this.lang == 'en' ? `Are you sure that you want to delete ${masterAssetDocument.title}?` : `هل أنت متأكد أنك تريد حذف ${masterAssetDocument.title}؟`}`,
     rejectButtonStyleClass:"p-button-text style='margin:0 15'",
     rejectLabel: this.lang === 'en' ? 'No' : 'لا', 
     acceptLabel: this.lang === 'en' ? 'Yes' : 'نعم',
     acceptIcon:"none",
     rejectIcon:"none",
     accept: ()=>{
      this.confirmationService.close();
       this.spinner.show();
       this.masterAssetService
               .DeleteMasterAssetAttachmentById(masterAssetDocument.id)
               .subscribe((result) => {
                this.lstAttachment.splice(rowIndex, 1);
                this.spinner.hide();
                this.showSuccessfullyMessage=true;
                if(this.lang=="en"){
                  this.SuccessfullyMessage="File deleted successfully";
                  this.SuccessfullyHeader="Delete" 
              }
              else
              {
                this.SuccessfullyMessage="تم حذف الملف بنجاح";
                this.SuccessfullyHeader="مسح" 
              }
               },
              (error)=>{
                this.errorDisplay=true;
                if(this.lang=="en")
                {this.errorMessage="An error occurred while deleting the file"}
                else
                {this.errorMessage="حدث خطأ أثناء حذف الملف."}
              });
    },
    reject:()=>{
      this.confirmationService.close();

    }
  })
  }
  validateBrand()
  {

    this.isInvalidBrand=!this.masterAssetObj.brandId;
  }
  downloadFile(fileName) {
    var filePath = `${environment.Domain}UploadedAttachments/`;

    this.uploadService.downloadMasterAssetFile(fileName).subscribe((file) => {
      var dwnldFile = filePath + 'MasterAssets/' + fileName;
      if (fileName != '' || fileName != null) window.open(dwnldFile);
    });
  }
  pad(num: string, size: number): string {
    while (num.length < size) num = "0" + num;
    return num;
  }
  addComponentToList() {
    if (this.compObj.compCode == "") {
      this.errorDisplay = true;
      if (this.lang == "en")
        this.errorMessage = "Please insert component code";
      else
        this.errorMessage = "ادخل كود المكون";
      return false;
    }
    if (this.compObj.compName == "") {
      this.errorDisplay = true;
      if (this.lang == "en")
        this.errorMessage = "Please insert name";
      else
        this.errorMessage = "أدخل اسم المكون";
      return false;
    }
    if (this.compObj.compNameAr == "") {
      this.errorDisplay = true;
      if (this.lang == "en")
        this.errorMessage = "Please insert component name in arabic";
      else
        this.errorMessage = "ادخل اسم المكون بالعربي";
      return false;
    }
    console.log(" this.CreateMasterAssetComponentVM :", this.CreateMasterAssetComponentVM);
    
    const compCodeexists = this.CreateMasterAssetComponentVM.some((Component) =>
      Component.compCode==this.compObj.compCode
    );
    if(!compCodeexists)
    {
      this.lstSavedComponents.some((Component) =>Component.code==this.compObj.compCode);
    }
 
    if(compCodeexists)
    {
      this.errorDisplay = true;
      if (this.lang == "en")
        this.errorMessage = "The component code already exists. Please enter a unique code.";
      else
        this.errorMessage = "رمز المكون موجود بالفعل. يرجى إدخال رمز فريد";
        return false;
    }
    const compNameexists = this.CreateMasterAssetComponentVM.some((Component) =>
      Component.compName==this.compObj.compName
    );
    if(!compNameexists)
      {
        this.lstSavedComponents.some((Component) =>
          Component.name==this.compObj.compName
        );
      }
    if(compNameexists)
    {
      this.errorDisplay = true;
      if (this.lang == "en")
        this.errorMessage = "The component Name already exists. Please enter a unique NameAr.";
      else
        this.errorMessage = "اسم المكون موجود بالفعل. يرجى إدخال اسم فريد";
        return false;
    }
  const compNameArexists = this.CreateMasterAssetComponentVM.some((Component) =>
      Component.compNameAr==this.compObj.compNameAr
    );
    if(!compNameArexists)
      {
        this.lstSavedComponents.some((Component) =>Component.nameAr==this.compObj.compNameAr);
      }
    if(compNameArexists)
    {
      this.errorDisplay = true;
      if (this.lang == "en")
        this.errorMessage = "The component NameAr already exists. Please enter a unique NameAr.";
      else
        this.errorMessage = "اسم المكون بالعربي موجود بالفعل. يرجى إدخال اسم فريد";
        return false;
    }
      let componentObj = new CreateMasterAssetComponentVM();
      componentObj.masterAssetId = Number(this.masterAssetId);
      componentObj.compName = this.compObj.compName;
      componentObj.compNameAr = this.compObj.compNameAr;
      componentObj.compDescription = this.compObj.compDescription;
      componentObj.compDescriptionAr = this.compObj.compDescriptionAr;
      componentObj.compCode = this.compObj.compCode;
      componentObj.price = this.compObj.price;
      componentObj.partNo = this.compObj.partNo;
      this.CreateMasterAssetComponentVM.push(componentObj);
      // reset Fileds
      this.compObj.compCode='';
      this.compObj.compName='';
      this.compObj.compNameAr='';
      this.compObj.compDescription='';
      this.compObj.compDescriptionAr='';
      this.compObj.price=0;
      this.compObj.partNo='';
      
  }
  DeleteNewAssetComponent(rowIndex:number)
  {
    this.CreateMasterAssetComponentVM.splice(rowIndex,1)

  }
  removeFromCreatelstPMTasks(index) {
      this.CreatelstPMTasks.splice(index, 1);
    }
  saveComponentToDB() {
    // this.lstSavedComponents.forEach((elemnt) => {
    //   this.masterAssetComponentService.CreateMasterAssetComponent(elemnt)
    //     .subscribe(() => {
    //       this.display = true;
    //       this.ref.close();
    //       this.route.navigate(['/dash/assets']);
    //     }, error => {
    //       this.errorDisplay = true;
    //       if (this.lang == "en") {
    //         if (error.error.status == 'code') {
    //           this.errorMessage = error.error.message;
    //         }
    //       }
    //       else {
    //         if (error.error.status == 'code') {
    //           this.errorMessage = error.error.messageAr;
    //         }
    //       }
    //       return false;
    //     });
    // });
  }

  addBrand() {
    const dialogRef2 = this.dialogService.open(CreateBrandComponent, {
      width: '50%',
      style: {
        'dir': this.lang == "en" ? 'ltr' : "rtl",
        "text-align": this.lang == "en" ? 'left' : "right",
        "direction": this.lang == "en" ? 'ltr' : "rtl"
      }
    });
    dialogRef2.onClose.subscribe((res) => {
      if (res != this.masterAssetObj.brandId) {
        this.lstBrands = [];
        this.brandService.GetBrands().subscribe(brands => {
          this.lstBrands = brands;
          this.masterAssetObj.brandId = res;
        });
      }
      else {
        this.masterAssetObj.brandId = this.masterAssetObj.brandId;
      }
    });
  }
  removeFileFromObjectArray(rowIndex) {
    
    this.lstMasterAssetDocuments.splice(rowIndex, 1);

  }
  uploadMultipleFile = (event: any) => {
    const files: FileList = event.target.files;

    if (files.length === 0) {
      return;
    }
    else {

      for (var i = 0; i < files.length; i++) {
        let fileToUpload = <File>files[i];
        var masterAssetDoc = new CreateMasterAssetAttachmentVM();
        this.formData.append('file', fileToUpload, fileToUpload.name);
        masterAssetDoc.fileName = fileToUpload.name;
        masterAssetDoc.masterFile = fileToUpload;
        masterAssetDoc.title = fileToUpload.name.split('.')[0];
        this.lstMasterAssetDocuments.push(masterAssetDoc);
      }
    }
    this.addMultiFilesToList();
  }
  addMultiFilesToList() {

    this.lstMasterAssetDocuments.forEach(masterAssetDocument => {
      masterAssetDocument.masterAssetId = Number(this.masterAssetId);
      let ext = masterAssetDocument.fileName.split('.').pop();
      let lastdocumentName = "";
      let imageIndex = "";

      if (this.itmIndex.length == 0) {
        this.masterAssetService.GetLastDocumentForMsterAssetId(Number(this.masterAssetId)).subscribe(lastDoc => {
          lastdocumentName = lastDoc.fileName;
          if (lastdocumentName == null) {
            var last_element = ++this.incremant;
            this.itmIndex.push(last_element);
            let ext = masterAssetDocument.fileName.split('.').pop();
            var hCode = this.pad(this.currentUser.hospitalCode, 4);
            var srCode = this.pad(this.masterAssetObj.code, 10);
            let newIndex = this.pad((last_element).toString(), 2);
            let WOFileName = hCode + "MA" + srCode + newIndex;
            masterAssetDocument.fileName = WOFileName + "." + ext;
          }
          else if (lastdocumentName != "") {

            imageIndex = lastdocumentName.split('.').slice(0, -1).join('.');
            imageIndex = imageIndex.substring(imageIndex.length - 2);
            this.itmIndex.push(imageIndex);
            //
            var newImageIndex = parseInt(imageIndex) + (++this.incremant);
            this.itmIndex.push(newImageIndex);

            var srCode = this.pad(this.masterAssetObj.code, 10);
            var last = this.itmIndex[this.itmIndex.length - 1];
            let newIndex = this.pad((last).toString(), 2);
            let woRFileName = "MA" + srCode + newIndex + "." + ext;
            masterAssetDocument.fileName = woRFileName;
          }
          else if (lastdocumentName == "") {

            var last_element = 1;
            this.itmIndex.push(last_element);
            let ext = masterAssetDocument.fileName.split('.').pop();
            var srCode = this.pad(this.masterAssetObj.code, 10);
            let newIndex = this.pad((last_element).toString(), 2);
            let WOFileName = "HA" + srCode + newIndex;
            masterAssetDocument.fileName = WOFileName + "." + ext;
          }
          masterAssetDocument = { fileName: '', masterAssetId: 0, title: '', masterFile: File };
        });
      }
      else if (this.itmIndex.length > 0) {
        var last_element = this.itmIndex[this.itmIndex.length - 1];
        last_element = parseInt(last_element) + (++this.incremant);
        this.itmIndex.push(last_element);

        var hCode = this.pad(this.currentUser.hospitalCode, 4);
        var srCode = this.pad(this.masterAssetObj.code, 10);
        let newIndex = this.pad((last_element).toString(), 2);
        let SRFileName = hCode + "MA" + srCode + newIndex;
        masterAssetDocument.fileName = SRFileName + "." + ext;
        masterAssetDocument = { fileName: '', masterAssetId: 0, title: '', masterFile: File };
      }
    });
  }
  addWOTaskToList() {
    let woObj = new CreateAssetWorkOrderTaskVM();
    woObj.masterAssetId = Number(this.masterAssetId);
    woObj.name = this.woTaskObj.name;
    woObj.nameAr = this.woTaskObj.nameAr;
    woObj.code = '';
    this.lstAddWOTasks.push(woObj);
  }
  removeItemFromTasks(tsk) {
    const index: number = this.lstAddWOTasks.indexOf(tsk);
    if (index !== -1) {
      this.lstAddWOTasks.splice(index, 1);
    }
  }
  removePMItem(idx) {
    const index: number = this.CreatelstPMTasks.indexOf(idx);
    if (index !== -1) {
      this.CreatelstPMTasks.splice(index, 1);
    }
  }
  addTaskToList() {
    if(this.pmTaskObj.taskname=='')
    {
      this.errorDisplay = true;
      if (this.lang == "en") {
        this.errorMessage = "Please Insert taskname";
    
      }
      else {
        this.errorMessage = "من فضلك ادخل اسم";
  
      }
      return false;
    }
    if(this.pmTaskObj.tasknameAr=='')
      {
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "Please Insert tasknameAr";
      
        }
        else {
          this.errorMessage = "من فضلك ادخل اسم بالعربي";
        }
        return false;
      }
      const tasknameexists = this.CreatelstPMTasks.some((task) =>
        task.taskname === this.pmTaskObj.taskname    
      );
    if(tasknameexists)
    {
      this.errorDisplay = true;
      if (this.lang == "en") {
        this.errorMessage = "A task with this name already exists. Please choose a different name.";
    
      }
      else {
        this.errorMessage = "هذا الاسم موجود بالفعل, من فضلك ادخل اسم مختلف";
  
      }
      this.pmTaskObj.taskname='';
      return false;
    }
    const tasknameArexists = this.CreatelstPMTasks.some((task) =>
      task.tasknameAr === this.pmTaskObj.tasknameAr
    );
  if(tasknameArexists)
  {
    this.errorDisplay = true;
    if (this.lang == "en") {
      this.errorMessage = "A task with this nameAr already exists. Please choose a different nameAr.";
  
    }
    else {
      this.errorMessage = "هذا الاسم موجود بالفعل, من فضلك ادخل اسم مختلف";

    }
    this.pmTaskObj.tasknameAr='';
    return false;
  }
    let pmObj = new CreatePMAssetTaskVM();
    pmObj.masterAssetId = Number(this.masterAssetId);
    pmObj.taskname = this.pmTaskObj.taskname;
    pmObj.tasknameAr = this.pmTaskObj.tasknameAr;
    this.CreatelstPMTasks.push(pmObj);
    console.log("this.CreatelstPMTasks :",this.CreatelstPMTasks);
    
  }

}
