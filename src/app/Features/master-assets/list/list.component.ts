import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { ListBrandVM } from 'src/app/Shared/Models/brandVM';
import { ListECRIVM } from 'src/app/Shared/Models/ecriVM';
import { ListMasterAssetVM, MasterAssetVM, SortAndFilterMasterAssetVM } from 'src/app/Shared/Models/masterAssetVM';
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
  loading: boolean = false;
  lstRoleNames: string[] = [];
  isAdmin: boolean = false;
  isHospitalManager: boolean = false;
  canAddMasterAsset: boolean = false;
  sortFilterObjects: SortAndFilterMasterAssetVM;
  @ViewChild('dt2') dataTable: Table;
  selectedMasterAssetName: any;

  constructor(    private confirmationService: ConfirmationService,private dialogService: DialogService, private dialog: MatDialog, private authenticationService: AuthenticationService,private ConfirmationService:ConfirmationService,private route: Router,
    private ecriService: ECRIService, private categoryService: CategoryService, private subCategoryService: SubCategoryService, private breadcrumbService: BreadcrumbService, private activateRoute: ActivatedRoute,
    private masterAssetService: MasterAssetService, private originService: OriginService, private brandService: BrandService,private MessageService:MessageService) { this.currentUser = this.authenticationService.currentUserValue; }



  ngOnInit(): void {
    const translationKeys = ['Asset.Assets', 'Asset.MasterAssets']; // Array of translation keys
    const parentUrlArray = this.breadcrumbService.getParentUrlSegments();
    this.breadcrumbService.addBreadcrumb(this.activateRoute.snapshot, parentUrlArray, translationKeys);
    this.currentUser["roleNames"].forEach(element => {
      this.lstRoleNames.push(element["name"]);
    });
    this.isAdmin = (['Admin'].some(r => this.lstRoleNames.includes(r)));
    this.isHospitalManager = (['TLHospitalManager'].some(r => this.lstRoleNames.includes(r)));
    this.canAddMasterAsset = (['AddMasterAsset'].some(r => this.lstRoleNames.includes(r)));

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

  


    this.sortFilterObjects = {
      searchObj: { assetNameAr: '', assetName: '', brandId: 0, ecriId: 0, modelNumber: '', originId: 0, categoryId: 0, subCategoryId: 0, code: '' },
      sortObj: {
        assetNameAr: '', assetName: '', brandName: '', brandNameAr: '', ecriName: '', ecriNameAr: '', sortBy: '',
        modelNumber: '', originName: '', originNameAr: '', categoryName: '', categoryNameAr: '', subCategoryName: '', subCategoryNameAr: '', code: '', sortStatus: ''
      }
    };
  }
  LoadMasterAssets(event) {
    console.log("event :",event)
    this.masterAssetService.GetListMasterAssets(this.sortFilterObjects, this.page.pagenumber, this.page.pagesize).subscribe((items) => {
      this.lstMasterAssets = items.results;
      this.count = items.count;
      this.loading = false;
    });
  }
  onSearch() {
    this.lstMasterAssets = [];
    this.count = 0;
    this.dataTable.first = 1;
    if (this.page.pagenumber !== 1) {
      this.page.pagenumber = 1;
    }
    this.sortFilterObjects.sortObj.sortStatus = this.sortStatus;
    this.masterAssetService.GetListMasterAssets(this.sortFilterObjects, 1, 10).subscribe((items) => {
      this.lstMasterAssets = items.results;
      this.count = items.count;
      this.loading = false;
    });
  }
  // sort(field) {

  //   if (this.sortStatus == "descending") {
  //     this.sortStatus = "ascending";
  //     this.sortFilterObjects.sortObj.sortStatus = this.sortStatus;
  //   }
  //   else {
  //     this.sortStatus = "descending";
  //     this.sortFilterObjects.sortObj.sortStatus = this.sortStatus;
  //   }

  //   this.sortFilterObjects.sortObj.sortBy = field.currentTarget.id;
  //   this.masterAssetService.GetListMasterAssets(this.sortFilterObjects, this.page.pagenumber, this.page.pagesize).subscribe((items) => {
  //     this.lstMasterAssets = items.results;
  //     this.count = items.count;
  //     this.loading = false;
  //   });

  // }
  addMasterAsset() {
    const dialogRef2 = this.dialogService.open(CreateComponent, {
      header: this.lang == "en" ? 'Add Master Asset' : "بيان إضافة أصل جديد",
      width: '80%',
      height:'650px',
      style: {
        'dir': this.lang == "en" ? 'ltr' : "rtl",
        "text-align": this.lang == "en" ? 'left' : "right",
        "direction": this.lang == "en" ? 'ltr' : "rtl"
      }
    });

    dialogRef2.onClose.subscribe((res) => {
     // this.reload();
    });
  }
  deleteMasterAsset(id: number) {
    // this.masterAssetService.GetMasterAssetById(id).subscribe((data) => {
    //   this.selectedObj = data;
   
    var masterAsset=this.lstMasterAssets.find((obj)=>{ return obj.id==id});
    this.confirmationService.confirm({
      header:`${this.lang == 'en' ? 'Delete Confirmation':'تأكيد المسح'}`,
     message: `${this.lang == 'en' ? `Are you sure that you want to delete ${masterAsset.name}?` : `هل أنت متأكد أنك تريد حذف ${masterAsset.nameAr}؟`}`,
      accept: ()=>{
        this.masterAssetService.DeleteMasterAsset(id).subscribe(deleted => {
          this.MessageService.add({severity:'success',summary:'Success',detail:'Deleted Successfully'})
          //delete from front
        
          console.log("lsmasterasset : ",this.lstMasterAssets)
        },
          (error) => {
            this.MessageService.add({severity:'error',summary:`${this.lang == 'en'?'Error':'خطأ'}`,detail:`${this.lang == 'en'?`${error.error.message}`:`${error.error.messageAr}`}`
            })
   
      },)}})
    
  }
  editMasterAsset(id: number) {
    const ref = this.dialogService.open(EditComponent, {
      data: {
        id: id,
      },
      header: this.lang == "en" ? 'Edit Master Asset' : "تعديل في البيان الرئيسي للأصل",
      width: '70%',
      style: {
        'dir': this.lang == "en" ? 'ltr' : "rtl",
        "text-align": this.lang == "en" ? 'left' : "right",
        "direction": this.lang == "en" ? 'ltr' : "rtl"
      }
    });

    ref.onClose.subscribe(() => {
      //   this.reload();
      //when click edit only
    });
  }
  viewMasterAsset(id: number) {
    const ref = this.dialogService.open(ViewComponent, {
      data: {
        id: id,
      },
      header: this.lang == "en" ? 'View Master Asset' : "البيان الرئيسي للأصل",
      width: '70%',
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
  reload() {
    let currentUrl = this.route.url;
    this.route.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.onSameUrlNavigation = 'reload';
    this.route.navigate([currentUrl]);
  }
  GetSubCategoryByCategoryId($event) {
    this.subCategoryService
      .GetSubCategoriesByCategoryId($event.target.value)
      .subscribe((subs) => {
        this.lstSubCategories = subs;
      });
  }
  clearSearch() {
    this.sortFilterObjects.sortObj.sortStatus = this.sortStatus;
    this.sortFilterObjects.searchObj.originId = 0;
    this.sortFilterObjects.searchObj.brandId = 0;
    this.sortFilterObjects.searchObj.categoryId = 0;
    this.sortFilterObjects.searchObj.subCategoryId = 0;
    this.sortFilterObjects.searchObj.modelNumber = '';
    this.sortFilterObjects.searchObj.assetName = "";
    this.sortFilterObjects.searchObj.assetNameAr = "";
    this.selectedMasterAssetName = null;
    this.lstMasterAssets = [];
    this.count = 0;
    //this.dataTable.first = 1;
    this.masterAssetService.GetListMasterAssets(this.sortFilterObjects, 1, 10).subscribe((items) => {
      this.lstMasterAssets = items.results;
      this.count = items.count;
      this.loading = false;
    });
  }
  // onPageChange(event: any) {
  //   this.page.pagenumber = (event.first + 10) / 10;
  //   this.page.pagesize = event.rows;
  // }
  onMasterAssetSelectionChanged(event) {
    this.masterAssetService.DistinctAutoCompleteMasterAssetName(event.query).subscribe(masters => {
      this.lstMasterAssetNames = masters;
      if (this.lang == "en") {
        this.lstMasterAssetNames.forEach(item => item.name = item.name);
      }
      else {
        this.lstMasterAssetNames.forEach(item => item.name = item.nameAr);
      }
    });
  }

  getMasterAssetObject(event) {
    if (this.lang == 'en')
      this.sortFilterObjects.searchObj.assetName = event["name"];
    else
      this.sortFilterObjects.searchObj.assetNameAr = event["nameAr"];

  }
  clearAutoCompelete(event) {
    this.selectedMasterAssetName = null;
    this.sortFilterObjects.searchObj.assetName = "";
    this.sortFilterObjects.searchObj.assetNameAr = "";
  }
}

