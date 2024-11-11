import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { ListBrandVM } from 'src/app/Shared/Models/brandVM';
import { ListECRIVM } from 'src/app/Shared/Models/ecriVM';
import { ListMasterAssetVM, MasterAssetVM, reloadTableObj, SearchSortMasterAssetVM } from 'src/app/Shared/Models/masterAssetVM';
import { ListOriginVM } from 'src/app/Shared/Models/originVM';
import { Paging } from 'src/app/Shared/Models/paging';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { BrandService } from 'src/app/Shared/Services/brand.service';
import { ECRIService } from 'src/app/Shared/Services/ecri.service';
import { MasterAssetService } from 'src/app/Shared/Services/masterAsset.service';
import { OriginService } from 'src/app/Shared/Services/origin.service';
import { CreateComponent } from '../create/create.component';
import { EditComponent } from '../edit/edit.component';
import { ViewComponent } from '../view/view.component';
import { CategoryService } from 'src/app/Shared/Services/category.service';
import { SubCategoryService } from 'src/app/Shared/Services/subcategory.service';
import { ListCategoryVM } from 'src/app/Shared/Models/categoryVM';
import { ListSubCategoryVM } from 'src/app/Shared/Models/subCategoryVM';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { Table } from 'primeng/table';
import { BreadcrumbService } from 'src/app/Shared/Services/Breadcrumb.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SectionModulePermisisons } from 'src/app/Shared/Models/Module';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  providers:[MessageService]
})
export class ListComponent implements OnInit {
  lang = localStorage.getItem("lang");
  currentUser: LoggedUser;
  errorDisplay: boolean = false;
  errorMessage: string = "";
  page: Paging;
  count: number;
  first: number = 0;
  rows: number = 10;
  sortStatus: string = "ascending";
  lstOrigins: ListOriginVM[] = [];
  lstBrands: ListBrandVM[] = [];
  lstCategories: ListCategoryVM[] = [];
  lstSubCategories: ListSubCategoryVM[] = [];
  lstMasterAssets: ListMasterAssetVM[] = [];
  lstMasterAssetNames: ListMasterAssetVM[] = [];
  lstECRIS: ListECRIVM[] = [];
  selectedObj: MasterAssetVM;
  lstRoleNames: string[] = [];
  isAdmin: boolean = false;
  isHospitalManager: boolean = false;
  canAddMasterAsset: boolean = false;
  SearchSortMasterAsset: SearchSortMasterAssetVM;
  displaySuccess=false;
  @ViewChild('dt2') dataTable: Table;
  selectedMasterAssetName: any;
  displaySuccessCreate=false;
  displaySuccessDelete =false;
  rowsSkipped:number=0;
  showFilter=false;
  reloadTableObj:reloadTableObj={sortOrder:1,sortField:'',first:0,rows:10};
  SectionModulePermisisons:SectionModulePermisisons[];
  SuccessfullyHeader:string='';
  SuccessfullyMessage:string='';
  showSuccessfullyMessage:boolean=false;
  loading:boolean=false;
  constructor(private spinner:NgxSpinnerService,private dialogService: DialogService, private dialog: MatDialog, private authenticationService: AuthenticationService,private confirmationService:ConfirmationService,private route: Router,
    private ecriService: ECRIService, private categoryService: CategoryService, private subCategoryService: SubCategoryService, private breadcrumbService: BreadcrumbService, private activateRoute: ActivatedRoute,
    private masterAssetService: MasterAssetService, private originService: OriginService, private brandService: BrandService,private MessageService:MessageService) { this.currentUser = this.authenticationService.currentUserValue; }
  ngOnInit(): void {
    this.authenticationService.AllModulesPermissionsForCurrentUser$.subscribe(
      res=>{this.SectionModulePermisisons=res
      }
    )
    this.SearchSortMasterAsset = {
        sortOrder: 1,
        sortFiled: '',
        eCRIId: 0,
        originId: 0,
        brandId:0, 
        categoryId: 0,
        subCategoryId: 0,
        code:  '',
        modelNumber:'',
        assetName: '',
        assetNameAr: ''
    };
    const translationKeys = ['Asset.Assets', 'Asset.MasterAssets']; 
    const parentUrlArray = this.breadcrumbService.getParentUrlSegments();
    this.breadcrumbService.addBreadcrumb(this.activateRoute.snapshot, parentUrlArray, translationKeys);
    this.page = {
      pagenumber: 1,
      pagesize: 10
    }
    this.onLoad();
  }
 
  
  onLoad() {
    this.ecriService.GetECRIS().subscribe(ecris => {
      this.lstECRIS = ecris;
    });
    this.originService.GetOrigins().subscribe(origins => {
      this.lstOrigins = origins;
    });
    this.categoryService.GetCategories().subscribe(categories => {
      this.lstCategories = categories;
    });
    this.brandService.GetBrands().subscribe(brands => {
      this.lstBrands = brands;
      
    });
  }

  CanAdd()
  {
    return this.authenticationService.hasPermission("add","Master Assets",this.SectionModulePermisisons)
  }
  CanDelete()
  {
    return this.authenticationService.hasPermission("delete","Master Assets",this.SectionModulePermisisons)
  }
  CanEdit()
  {
    return this.authenticationService.hasPermission("edit","Master Assets",this.SectionModulePermisisons)
  }
  CanView()
  {
    return this.authenticationService.hasPermission("view","Master Assets",this.SectionModulePermisisons)
  }
  LoadMasterAssets(event) {
    this.spinner.show()
    this.SearchSortMasterAsset.sortOrder=event.sortOrder;
    this.SearchSortMasterAsset.sortFiled=event.sortField;
    this.rowsSkipped=event.first;
      this.masterAssetService.GetListMasterAssets(event.first, event.rows,this.SearchSortMasterAsset).subscribe((items) => {
      this.lstMasterAssets = items.results;     
      this.count = items.count;
      this.spinner.hide();
      
    },error=>{
      
      this.spinner.hide();
    }
    );
}
  onSearch() {
    
    if( this.SearchSortMasterAsset.brandId == 0 &&this.SearchSortMasterAsset.originId==0 && this.SearchSortMasterAsset.categoryId==0 && this.SearchSortMasterAsset.subCategoryId==0 && this.SearchSortMasterAsset.modelNumber=='' && this.SearchSortMasterAsset.assetName=='')
    {
      this.errorDisplay=true;
        if (this.lang == "en") {
          this.errorMessage = "Please enter a search term before clicking 'Search'.";
        }
        else {
          this.errorMessage = "'يرجى الادخال قبل النقر على 'بحث";
        }
        return ;
     }
  //  this.SearchSortMasterAsset.modelNumber=this.SearchSortMasterAsset.modelNumber?.trim() ?? ''
  //  this.SearchSortMasterAsset.assetName=this.SearchSortMasterAsset.assetName?.trim() ?? ''
  this.reloadTableObj={sortOrder:1,sortField:'',first:0,rows:10}
  this.LoadMasterAssets(this.reloadTableObj);
  }
  addMasterAsset () {
    const dialogRef2 = this.dialogService.open(CreateComponent, {
      header: this.lang == "en" ? 'Add Master Asset' : "بيان إضافة أصل جديد",
      width: '80%',
      style: {
        'dir': this.lang == "en" ? 'ltr' : "rtl",
        "text-align": this.lang == "en" ? 'left' : "right",
        "direction": this.lang == "en" ? 'ltr' : "rtl"
      }
    });
    dialogRef2.onClose.subscribe( (Created) => {
     if(Created){
      const lastPageIndex = Math.max(0, Math.floor((this.count) / 10) * 10);
      this.reloadTableObj.first=lastPageIndex;
        this.LoadMasterAssets(this.reloadTableObj);
       this.dataTable.first=this.count;
      this.showSuccessfullyMessage  =true;
      if(this.lang=="en"){
        this.SuccessfullyMessage="Added successfully";
        this.SuccessfullyHeader="Add" 
    }
    else
    {
      this.SuccessfullyMessage="تم حفظ البيانات بنجاح"
      this.SuccessfullyHeader="حفظ" 
    }
    }});
  }
  deleteMasterAsset(masterAsset:any) {
    this.confirmationService.confirm({
       header:`${this.lang == 'en' ? 'Delete Confirmation':'تأكيد المسح'}`,
      message: `${this.lang == 'en' ? `Are you sure that you want to delete ${masterAsset.name}?` : `هل أنت متأكد أنك تريد حذف ${masterAsset.nameAr}؟`}`,
      rejectButtonStyleClass:"p-button-text style='margin:0 10'",
      rejectLabel: this.lang === 'en' ? 'No' : 'لا', 
      acceptLabel: this.lang === 'en' ? 'Yes' : 'نعم',
      acceptIcon:"none",
      rejectIcon:"none",
      accept: ()=>{
        this.spinner.show();
        this.masterAssetService.DeleteMasterAsset(masterAsset.id).subscribe(deleted => {
          this.spinner.hide();
          this.reloadTableObj.first= this.rowsSkipped;
          this.LoadMasterAssets(this.reloadTableObj);
          this.dataTable.first= this.rowsSkipped;
          this.showSuccessfullyMessage=true;
          if(this.lang=="en"){
            this.SuccessfullyMessage="Deleted Successfully";
            this.SuccessfullyHeader="Delete" 
        }
        else
        {
          this.SuccessfullyMessage="تم حذف البيانات بنجاح";
          this.SuccessfullyHeader="مسح" 
        }
        },
          (error) => {
            this.errorDisplay=true;
            this.errorMessage=`${this.lang == 'en'?`${error.error.message}`:`${error.error.messageAr}`}`;
      },)}})
  }
  editMasterAsset(id: number,i:number) {
    
    const ref = this.dialogService.open(EditComponent, {
      data: {
        id: id,
      },
      header: this.lang == "en" ? 'Edit Master Asset' : "تعديل في البيان الرئيسي للأصل",
      width: '80%',
      style: {
        'dir': this.lang == "en" ? 'ltr' : "rtl",
        "text-align": this.lang == "en" ? 'left' : "right",
        "direction": this.lang == "en" ? 'ltr' : "rtl"
      }
    });
    ref.onClose.subscribe((edit) => {
      if(edit)
      {
       var first=Math.floor(i/10)*10;
      this.reloadTableObj.first=first;
      this.dataTable.first=first;
      this.LoadMasterAssets(this.reloadTableObj)
      this.showSuccessfullyMessage=true;
      if(this.lang=="en"){
        this.SuccessfullyMessage="Updated successfully";
        this.SuccessfullyHeader="Update" 
    }
    else
    {
      this.SuccessfullyMessage="تم التعديل بنجاح";
      this.SuccessfullyHeader="تعديل" 
    }
      }
    });
  }
  viewMasterAsset(id: number) {
    const ref = this.dialogService.open(ViewComponent, {
      data: {
        id: id,
      },
      header: this.lang == "en" ? 'View Master Asset' : "البيان الرئيسي للأصل",
      width: '80%',
      style: {
        'dir': this.lang == "en" ? 'ltr' : "rtl",
        "text-align": this.lang == "en" ? 'left' : "right",
        "direction": this.lang == "en" ? 'ltr' : "rtl"
      }
    });

    ref.onClose.subscribe(() => {
      // this.reload();
    });
  }
 
  GetSubCategoryByCategoryId($event) {
    this.subCategoryService
      .GetSubCategoriesByCategoryId($event.target.value)
      .subscribe((subs) => {
        this.lstSubCategories = subs;
      });
  }
  clearSearch() {  
    if( this.SearchSortMasterAsset.brandId === 0 &&
      this.SearchSortMasterAsset.originId === 0 &&
      this.SearchSortMasterAsset.categoryId === 0 &&
      this.SearchSortMasterAsset.subCategoryId === 0 &&
      (this.SearchSortMasterAsset.modelNumber === "" || this.SearchSortMasterAsset.modelNumber === '') &&
      (this.SearchSortMasterAsset.assetName === "" || this.SearchSortMasterAsset.assetName === ''))
      {
        this.errorDisplay=true;
          if (this.lang == "en") {
            this.errorMessage = "No data to clear.";
          }
          else {
            this.errorMessage = ".لا يوجد بيانات للحذف";
          }
          return ;
       }
    this.SearchSortMasterAsset.originId = 0;
    this.SearchSortMasterAsset.brandId = 0;
    this.SearchSortMasterAsset.categoryId = 0;
    this.SearchSortMasterAsset.subCategoryId = 0;
    this.SearchSortMasterAsset.modelNumber = '';
    this.SearchSortMasterAsset.assetName = "";
    this.SearchSortMasterAsset.assetNameAr = "";
    

   this.reloadTableObj={sortOrder:1,sortField:'',first:0,rows:10}
   this.LoadMasterAssets(this.reloadTableObj);
  }
  // onPageChange(event: any) {
  //   this.page.pagenumber = (event.first + 10) / 10;
  //   this.page.pagesize = event.rows;
  // }
  onMasterAssetSelectionChanged(event) {
    this.masterAssetService.DistinctAutoCompleteMasterAssetName(event.query).subscribe(masterAssets => {
      if(masterAssets==null)
      {
        this.lstMasterAssetNames=[];
      }
      else{
        this.lstMasterAssetNames = masterAssets;
        if(this.lstMasterAssetNames!=null)
        {
          if (this.lang == "en") {
            this.lstMasterAssetNames.forEach(item => item.name = item.name);
          }
          else {
            this.lstMasterAssetNames.forEach(item => item.name = item.nameAr);
          }
        }
      }
      
   
    });
  }

  getMasterAssetObject(event) {

    if (this.lang == 'en')
      this.SearchSortMasterAsset.assetName = event["name"];
    else
      this.SearchSortMasterAsset.assetNameAr = event["nameAr"];
  }
  clearAutoCompelete(event) {
    this.selectedMasterAssetName = null;
    this.SearchSortMasterAsset.assetName = "";
    this.SearchSortMasterAsset.assetNameAr = "";
  }
}

