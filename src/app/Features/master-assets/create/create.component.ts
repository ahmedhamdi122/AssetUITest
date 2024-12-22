import { Component, ElementRef, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { ListAssetPeriorityVM } from 'src/app/Shared/Models/assetPeriorityVM';
import { CreateAssetWorkOrderTaskVM } from 'src/app/Shared/Models/AssetWorkOrderTaskVM';
import { ListBrandVM } from 'src/app/Shared/Models/brandVM';
import { ListCategoryVM } from 'src/app/Shared/Models/categoryVM';
import { ListECRIVM } from 'src/app/Shared/Models/ecriVM';
import { CreateMasterAssetAttachmentVM, CreateMasterAssetVM, CreatePMAssetTaskVM } from 'src/app/Shared/Models/masterAssetVM';
import { ListOriginVM } from 'src/app/Shared/Models/originVM';
import { ListPMTimeVM } from 'src/app/Shared/Models/pmTimeVM';
import { ListSubCategoryVM } from 'src/app/Shared/Models/subCategoryVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { AssetWorkOrderTaskService } from 'src/app/Shared/Services/asset-work-order-task.service';
import { AssetPeriorityService } from 'src/app/Shared/Services/assetperiority.service';
import { BrandService } from 'src/app/Shared/Services/brand.service';
import { CategoryService } from 'src/app/Shared/Services/category.service';
import { ECRIService } from 'src/app/Shared/Services/ecri.service';
import { MasterAssetService } from 'src/app/Shared/Services/masterAsset.service';
import { OriginService } from 'src/app/Shared/Services/origin.service';
import { SubCategoryService } from 'src/app/Shared/Services/subcategory.service';
import { UploadFilesService } from 'src/app/Shared/Services/uploadfilesservice';
import { ViewChild } from '@angular/core';
import { CreateMasterAssetComponentVM } from 'src/app/Shared/Models/masterAssetComponentVM';
import { MasterAssetComponentService } from 'src/app/Shared/Services/masterAssetComponent.service';
import { ListCategoryTypeVM } from 'src/app/Shared/Models/categoryTypeVM';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { CategoryTypeService } from 'src/app/Shared/Services/categoryType.service';
import { Router } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CreateBrandComponent } from 'src/app/Features/brands/create-brand/create-brand.component';
import { PMTimeService } from 'src/app/Shared/Services/pmtime.service';
import { MatTabGroup } from '@angular/material/tabs';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit {
  lang = localStorage.getItem('lang');
  textDir: string = 'ltr';
  currentUser: LoggedUser;
  lstTypes: ListCategoryTypeVM[] = [];
  lstCategories: ListCategoryVM[] = [];
  lstSubCategories: ListSubCategoryVM[] = [];
  lstBrands: ListBrandVM[] = [];
  lstOrigins: ListOriginVM[] = [];
  lstPeriorities: ListAssetPeriorityVM[] = [];
  lstPMTimes: ListPMTimeVM[] = [];
  lstECRIs: ListECRIVM[] = [];
  masterAssetObj: CreateMasterAssetVM;
  woTaskObj: CreateAssetWorkOrderTaskVM;
  lstWOTasks: CreateAssetWorkOrderTaskVM[] = [];
  isInvalidBrand=true;
  masterAssetId: number;
  radioPerioritySelected: string='3';
  selectedFiles: FileList;
  progressInfos = [];
  message = '';
  fname = '';
  fileInfos: Observable<any>;
  savedfilesdisplay: boolean = false;
  selectedCategory: any;
  selectedPMTime: any;
  selectedDepartment: any;

  errorMessage: string;
  errorDisplay: boolean = false;
  display: boolean = false;
  title: string = '';
  isSaved: boolean = false;

  uploadFileName: string;
  fileName = '';
  savedBrandDisplay:boolean=false;
  masterAssetDocument: CreateMasterAssetAttachmentVM;
  lstMasterAssetDocuments: CreateMasterAssetAttachmentVM[] = [];

  pmTaskObj: CreatePMAssetTaskVM;
  lstPMTasks: CreatePMAssetTaskVM[] = [];
  lstTasks: CreatePMAssetTaskVM[] = [];

  compObj: CreateMasterAssetComponentVM;
  lstComponents: CreateMasterAssetComponentVM[] = [];

  itmIndex: any[] = [];
  formData = new FormData();
  imagePath: any = "";
  public file: File;
  incremant: number = 0;
  @ViewChild('fileUpload', { static: false })
  upfile: ElementRef;
  imgVisible: boolean = true;
  btnHidden: boolean = true;
  fileToUpload: File;
  @ViewChild('tabGroup') tabGroup: MatTabGroup;
  isAdmin: boolean = false;
  isHospitalManager: boolean = false;
  canAddBrand: boolean = true;
  lstRoleNames: string[] = [];
  invalidAssetName=false;
  invalidAssetNameAr=false;
  invalidModelNumber=false;
  invalidVersionNumber=false;
  public taskForm: FormGroup;
  constructor(
    private authenticationService: AuthenticationService, private masterAssetService: MasterAssetService, private masterAssetComponentService: MasterAssetComponentService, private uploadService: UploadFilesService, private categoryTypeService: CategoryTypeService, private categoryService: CategoryService, private subCategoryService: SubCategoryService, private originService: OriginService,
    private brandService: BrandService, private ecriService: ECRIService, private assetPeriorityService: AssetPeriorityService, private pmTimeService: PMTimeService, private assetWorkOrderTaskService: AssetWorkOrderTaskService, private dialogService: DialogService,private spinner:NgxSpinnerService,
    private route: Router, private ref: DynamicDialogRef) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit(): void {
    if (this.lang == 'en') {
      this.textDir = 'ltr';
    } else if (this.lang == 'ar') {
      this.textDir = 'rtl';
    }
    // if (this.currentUser) {
    //   this.currentUser["roleNames"].forEach(element => {
    //     this.lstRoleNames.push(element["name"]);
    //   });

      // this.isAdmin = (['Admin'].some(r => this.lstRoleNames.includes(r)));
      // this.isHospitalManager = (['TLHospitalManager'].some(r => this.lstRoleNames.includes(r)));
      // this.canAddBrand = (['AddBrand'].some(r => this.lstRoleNames.includes(r)));
  
    this.masterAssetDocument = { fileName: '', masterAssetId: 0, masterFile: File, title: '' };
    this.pmTaskObj = { tasknameAr: '', taskname: '', masterAssetId: 0 }
    this.woTaskObj = { name: '', nameAr: '', code: '', masterAssetId: 0, id: 0 }
    this.compObj = { compCode: '', compName: '', compNameAr: '', partNo: "", price: 0, masterAssetId: 0, compDescription: '', compDescriptionAr: '' }
    this.masterAssetObj = {
      id: 0,
      ecriId: null, brandId: null, categoryId: null, code: '', description: '', descriptionAr: '', expectedLifeTime: null, height: null, length: null, modelNumber: '', name: '', nameAr: '', originId: null,
      periorityId: null, subCategoryId: null, versionNumber: '', weight: null, width: null, title: '', power: '', voltage: '', ampair: '', frequency: '', electricRequirement: '',
      createPMAssetTaskVM: [], pmTimeId: 0, assetImg: ''
    };

    this.pmTimeService.GetPMTimes().subscribe((pmtimes) => {
      this.lstPMTimes = pmtimes;
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



    this.masterAssetService.GenerateMasterAssetcode().subscribe(master => {
      this.masterAssetObj.code = master["code"];
    });
    this.getSelecteditem();
    this.selectedPMTime = 1;
    this.categoryTypeService.GetCategoryTypes().subscribe(types => { this.lstTypes = types })
  }
  getSelecteditem() {
    
    this.masterAssetObj.periorityId = Number(this.radioPerioritySelected);
  }
  GetCategoriesByCategoryTypeId($event) {
    this.categoryService.GetCategoryByCategoryTypeId($event.target.value).subscribe(categories => { this.lstCategories = categories })
  }
  GetSubCategoryByCategoryId($event) {
    this.subCategoryService
      .GetSubCategoriesByCategoryId($event.target.value)
      .subscribe((subs) => {
        this.lstSubCategories = subs;
      });
  }
  removeItemFromTasks(tsk) {
    const index: number = this.lstWOTasks.indexOf(tsk);
    if (index !== -1) {
      this.lstWOTasks.splice(index, 1);
    }
  }
  // addWOTaskToList() {
  //   let woObj = new CreateAssetWorkOrderTaskVM();
  //   woObj.masterAssetId = Number(this.masterAssetId);
  //   woObj.name = this.woTaskObj.name;
  //   woObj.nameAr = this.woTaskObj.nameAr;
  //   woObj.code = '';
  //   this.lstWOTasks.push(woObj);
  // }
  // saveWOTaskToDB() {
  //   this.lstWOTasks.forEach((elemnt) => {
  //     this.assetWorkOrderTaskService.CreateAssetWorkOrderTask(elemnt)
  //       .subscribe(() => {
  //         this.display = true;
  //       });
  //   });
  // }
  onTimeChange($event) {
    this.selectedPMTime = $event.value;
  }
  onSubmit() {
    if(this.masterAssetObj.name=='')
    {
      this.errorDisplay = true;
      if (this.lang == "en") {
        this.errorMessage = "Please Insert Name";
        this.tabGroup.selectedIndex=0;
      }
      else {
        this.errorMessage = "من فضلك ادخل اسم";
        this.tabGroup.selectedIndex=0;
      }
      return false;
    }
    if(this.masterAssetObj.nameAr=='')
      {
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "Please Insert Name In Arabic";
          this.tabGroup.selectedIndex=0;
        }
        else {
          this.errorMessage = "من فضلك ادخل اسم بالعربي";
          this.tabGroup.selectedIndex=0;
        }
        return false;
      }
     if (this.masterAssetObj.brandId == null) {
      this.errorDisplay = true;
      if (this.lang == "en") {
        this.errorMessage = "Please select Brand";
        this.tabGroup.selectedIndex=0;
      }
      else {
        this.errorMessage = "من فضلك اختر ماركة";
        this.tabGroup.selectedIndex=0;
      }
      return false;
    }
    console.log("master asset :",this.masterAssetObj)
    this.masterAssetService.CreateMasterAsset(this.masterAssetObj).subscribe(assetObj => {
      this.masterAssetId = assetObj;
      if (this.file) {
        let ext = this.file.name.split('.').pop();
        var hCode = this.pad(this.currentUser.hospitalCode, 4);
        var srCode = this.pad(this.masterAssetObj.code, 10);
        let newIndex = this.pad((this.masterAssetId).toString(), 2);
        let HospitalAssetFileName = hCode + "MA" + srCode + newIndex;
        let masterFileName = HospitalAssetFileName + "." + ext;
        this.masterAssetObj.assetImg = masterFileName;
        this.masterAssetObj.id = this.masterAssetId;
        console.log("master asset to image  :",this.masterAssetObj)

        this.masterAssetService.UpdateMasterAssetImageAfterInsert(this.masterAssetObj).subscribe(master => {
          this.uploadService
            .uploadMasterAssetImage(this.file, masterFileName)
            .subscribe(
              (event) => { },
              (err) => {
                this.message = 'Could not upload the file:' + masterFileName;
              });
        });
      }
      if (this.lstMasterAssetDocuments.length > 0) {
        this.lstMasterAssetDocuments.forEach((elemnt, index) => {
          elemnt.masterAssetId = this.masterAssetId;
          
          this.masterAssetService.CreateMasterAssetAttachments(elemnt).subscribe(lstfiles => {
            this.uploadService.uploadMasterAssetFiles(elemnt.masterFile, elemnt.fileName).subscribe(
              (event) => {
                // this.isSaved = true;
                // this.display = true;
                // this.reload();
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
      if (this.lstComponents.length > 0) {
        this.lstComponents.forEach((elemnt) => {
          elemnt.masterAssetId = this.masterAssetId;

          this.masterAssetComponentService.CreateMasterAssetComponent(elemnt)
            .subscribe(() => {
              // this.display = true;
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
      if (this.lstPMTasks.length > 0) {
        this.lstPMTasks.forEach((elemnt) => {
          elemnt.masterAssetId = this.masterAssetId;
          this.masterAssetService.AddPMAssetTask(elemnt)
            .subscribe(() => {
            });
        });
      }
    
      var created='Created';
      this.ref.close(created)

    },
      error => {
        this.errorDisplay = true;
        if (this.lang == 'en') {
          if (error.error.status == 'brnd') {
            this.errorMessage = error.error.message;
          }
          if (error.error.status == 'codelen') {
            this.errorMessage = error.error.message;
          }
          if (error.error.status == 'CodeRequired') {
            this.errorMessage = error.error.message;
          }
          if (error.error.status == 'nameRequired') {
            this.errorMessage = error.error.message;
          }
          if(error.error.status=='codelen')
          {
            this.errorMessage=error.error.message;
          }
          if (error.error.status == 'nameRequired') {
            this.errorMessage = error.error.message;
          }
          if (error.error.status == 'ExistsByNameModelAndVersion') {
            this.errorMessage = error.error.message;
          }
          if (error.error.status == "ExistsByNameArModelAndVersion") {
            this.errorMessage = error.error.message;
          }
        } if (this.lang == 'ar') {
          if (error.error.status == 'brand') {
            this.errorMessage = error.error.messageAr;
          }
          if (error.error.status == 'codelen') {
            this.errorMessage = error.error.messageAr;
          }
          if (error.error.status == 'codeExists') {
            this.errorMessage = error.error.messageAr;
          }
          if (error.error.status == 'ExistsByNameModelAndVersion') {
            this.errorMessage = error.error.messageAr;
          }
          if (error.error.status == "ExistsByNameArModelAndVersion") {
            this.errorMessage = error.error.messageAr;
          }
        }
        this.tabGroup.selectedIndex=0;

        return false;
      });

  } 
 
  onFileSelected(event) {
    this.file = event.target.files[0];
    if (this.file) {
      var reader = new FileReader();
      reader.readAsDataURL(this.file);
      reader.onload = (event) => {
        this.imagePath = event.target.result;
        this.imgVisible = false;
        this.btnHidden = false;
      }
     
    }
  }
  validateBrand()
  {

    this.isInvalidBrand=!this.masterAssetObj.brandId;
  }
  resetFile() {
    this.upfile.nativeElement.value = "";
    this.imgVisible = true;
    this.btnHidden = true;
  }
  pad(num: string, size: number): string {
    while (num.length < size) num = "0" + num;
    return num;
  }
  removeFileFromObjectArray(rowIndex) {

    this.lstMasterAssetDocuments.splice(rowIndex, 1);
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
   
      const tasknameexists = this.lstPMTasks.some((task) =>
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
    const tasknameArexists = this.lstPMTasks.some((task) =>
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
    this.lstPMTasks.push(pmObj);
  }
  removeTaskFromObjectArray(index:any)
  {
    this.lstPMTasks.splice(index,1)
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
 
    const compCodeexists = this.lstComponents.some((Component) =>
      Component.compCode==this.compObj.compCode
    );
    if(compCodeexists)
    {
      this.errorDisplay = true;
      if (this.lang == "en")
        this.errorMessage = "The component code already exists. Please enter a unique code.";
      else
        this.errorMessage = "رمز المكون موجود بالفعل. يرجى إدخال رمز فريد";
        return false;
    }
    const compNameexists = this.lstComponents.some((Component) =>
      Component.compName==this.compObj.compName
    );
    if(compNameexists)
    {
      this.errorDisplay = true;
      if (this.lang == "en")
        this.errorMessage = "The component Name already exists. Please enter a unique NameAr.";
      else
        this.errorMessage = "اسم المكون موجود بالفعل. يرجى إدخال اسم فريد";
        return false;
    }
  const compNameArexists = this.lstComponents.some((Component) =>
      Component.compNameAr==this.compObj.compNameAr
    );
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
      this.lstComponents.push(componentObj);
    
  }
  removeComponentItem(index) {

      this.lstComponents.splice(index, 1);
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
    dialogRef2.onClose.subscribe((brandId) => {
      this.lstBrands = [];
      if(brandId)
      {
        this.savedBrandDisplay=true;
        this.spinner.show();
        this.brandService.GetBrands().subscribe(brands => {
          this.lstBrands = brands;
          this.masterAssetObj.brandId = brandId;
          this.isInvalidBrand=false;
          this.spinner.hide();
        });
      }
    
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
        var masterAssetDocument = new CreateMasterAssetAttachmentVM();
        this.formData.append('file', fileToUpload, fileToUpload.name);
        masterAssetDocument.fileName = fileToUpload.name;
        masterAssetDocument.masterFile = fileToUpload;
        masterAssetDocument.title = fileToUpload.name.split('.')[0];
        this.lstMasterAssetDocuments.push(masterAssetDocument);
      }
      this.addMultiFilesToList();
    }
  }
  addMultiFilesToList() {
    this.lstMasterAssetDocuments.forEach(element => {
      element.masterAssetId = Number(this.masterAssetId);
      if (this.itmIndex.length === 0) {
        last_element = 1;
      }
      else if (this.itmIndex.length > 0) {
        var last_element = this.itmIndex[this.itmIndex.length - 1];
        last_element = last_element + 1;
      }
      this.itmIndex.push(last_element);
      let ext = element.fileName.split('.').pop();
      var code = this.pad(this.masterAssetObj.code, 10);
      var last = this.itmIndex[this.itmIndex.length - 1];
      let newIndex = this.pad((last).toString(), 2);
      let newFileName = "MA" + code + newIndex;
      element.fileName = newFileName + "." + ext;
      element = { fileName: '', masterAssetId: 0, title: '', masterFile: File };
    });
  }
}
