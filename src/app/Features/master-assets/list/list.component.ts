import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { ListBrandVM } from 'src/app/Shared/Models/brandVM';
import { ListECRIVM } from 'src/app/Shared/Models/ecriVM';
import { ListMasterAssetVM, MasterAssetVM, SearchSortMasterAssetVM } from 'src/app/Shared/Models/masterAssetVM';
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
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SectionModulePermisisons } from 'src/app/Shared/Models/Module';
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
  isLoading: boolean = true;
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
  reloadTableObj={"sortOrder":1,"sortField":null,"first":0,"rows":10};
  SectionModulePermisisons:SectionModulePermisisons[];
  constructor(    private confirmationService: ConfirmationService,private dialogService: DialogService, private dialog: MatDialog, private authenticationService: AuthenticationService,private ConfirmationService:ConfirmationService,private route: Router,
    private ecriService: ECRIService, private categoryService: CategoryService, private subCategoryService: SubCategoryService, private breadcrumbService: BreadcrumbService, private activateRoute: ActivatedRoute,
    private masterAssetService: MasterAssetService, private originService: OriginService, private brandService: BrandService,private MessageService:MessageService,private ngxService:NgxUiLoaderService) { this.currentUser = this.authenticationService.currentUserValue; }
  ngOnInit(): void {
    this.SectionModulePermisisons=[
      {
        icon: "pi pi-structure", 
        sectionName: "Structure",
        sectionNameAr: "الهيكل الهرمي",
        moduleWithPermissionNames: [
          {
            icon: "",
            route: "governorates",
            moduleName: "Governorate",
            moduleNameAr: "المحافظات",
            permissionNames: ["add", "edit", "delete"],
          },
          {
            icon: "",
            route: "organizations",
            moduleName: "Organization",
            moduleNameAr: "الهيئات",
            permissionNames: ["add", "delete"],
          },
          {
            icon: "",
            route: "hospitals",
            moduleName: "Hospitals",
            moduleNameAr: "المستشفيات",
            permissionNames: ["delete"],
          },
          {
            icon: "",
            route: "buildings",
            moduleName: "Buildings",
            moduleNameAr: "المباني",
            permissionNames: ["add", "delete"],
          },
          {
            icon: "",
            route: "departments",
            moduleName: "Departments",
            moduleNameAr: "الأقسام",
            permissionNames: ["delete"],
          },
        ],
      },
      {
        icon: "pi pi-assets", 
        sectionName: "Assets",
        sectionNameAr: "الأصول",
        moduleWithPermissionNames: [
          {
            icon: "",
            route: "assets",
            moduleName: "Master Assets",
            moduleNameAr: "الأصول الرئيسية",
            permissionNames: ["add", "edit", "delete"],
          },
          {
            icon: "",
            route: "hospitalassets",
            moduleName: "Hospital Assets",
            moduleNameAr: "أصول المستشفى",
            permissionNames: ["add", "delete"],
          },
          {
            icon: "",
            route: "origins",
            moduleName: "Origins",
            moduleNameAr: "بلد المنشأ",
            permissionNames: ["delete"],
          },
          {
            icon: "",
            route: "",
            moduleName: "Manufactures",
            moduleNameAr: "الماركات",
            permissionNames: ["add", "delete"],
          },
          {
            icon: "",
            route: "suppliers",
            moduleName: "Suppliers",
            moduleNameAr: "الموردين",
            permissionNames: ["delete"],
          },
          {
            icon: "",
            route: "categories",
            moduleName: "Categories",
            moduleNameAr: "الفئات",
            permissionNames: ["delete"],
          },
        ],
      },
      {
        icon: "pi pi-settings",  // Example icon for Settings section
        sectionName: "Settings",
        sectionNameAr: "الإعدادات",
        moduleWithPermissionNames: [
          {
            icon: "",
            route: "rolecategories",
            moduleName: "Role Categories",
            moduleNameAr: "فئة الأدوار",
            permissionNames: ["add", "edit", "delete"],
          },
          {
            icon: "",
            route: "roles",
            moduleName: "Roles",
            moduleNameAr: "المهام",
            permissionNames: ["add", "delete"],
          },
          {
            icon: "",
            route: "users",
            moduleName: "Users",
            moduleNameAr: "المستخدمين",
            permissionNames: ["delete"],
          },
          {
            icon: "",
            route: "",
            moduleName: "Employees",
            moduleNameAr: "الموظفين",
            permissionNames: ["add", "delete"],
          },
          {
            icon: "",
            route: "",
            moduleName: "Speciality",
            moduleNameAr: "التصنيف",
            permissionNames: ["delete"],
          },
          {
            icon: "",
            route: "",
            moduleName: "ECRIS",
            moduleNameAr: "ECRIS",
            permissionNames: ["delete"],
          },
          {
            icon: "",
            route: "",
            moduleName: "Visits",
            moduleNameAr: "الزيارات",
            permissionNames: ["delete"],
          },
          {
            icon: "",
            route: "",
            moduleName: "Engineers",
            moduleNameAr: "المهندسين",
            permissionNames: ["delete"],
          },
        ],
      },
    ];
        
    console.log( "hasPermission",this.hasPermission("add"," Assets"));
     //this.hasPermission("add","Master Assets")

    this.SearchSortMasterAsset = {
        sortOrder: 0,
        sortFiled: null,
        eCRIId: 0,
        originId: 0,
        brandId:0, 
        categoryId: 0,
        subCategoryId: 0,
        code: null,
        modelNumber:null,
        assetName: null,
        assetNameAr: null
    };
    const translationKeys = ['Asset.Assets', 'Asset.MasterAssets']; // Array of translation keys
    const parentUrlArray = this.breadcrumbService.getParentUrlSegments();
    this.breadcrumbService.addBreadcrumb(this.activateRoute.snapshot, parentUrlArray, translationKeys);
    // this.currentUser["roleNames"].forEach(element => {
    //   this.lstRoleNames.push(element["name"]);
    // });
    this.isAdmin = (['Admin'].some(r => this.lstRoleNames.includes(r)));
    this.isHospitalManager = (['TLHospitalManager'].some(r => this.lstRoleNames.includes(r)));
    this.canAddMasterAsset = (['AddMasterAsset'].some(r => this.lstRoleNames.includes(r)));
    this.page = {
      pagenumber: 1,
      pagesize: 10
    }
    this.onLoad();
  }
 
  hasPermission(requiredPermissions: string, moduleName: string): boolean {
    // Loop through each section
    for (const section of this.SectionModulePermisisons) {
      // Loop through each module in the current section
      const module = section.moduleWithPermissionNames.find(m => m.moduleName === moduleName);
      // If the module is found, check if it has any of the required permissions
      if (module) {
         module.permissionNames.find(permission => module.permissionNames.includes(permission));
      }
    }
    // Return false if the module is not found or has no required permissions
    return false;
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
  LoadMasterAssets(event) {
    this.ngxService.start('loading');
    this.SearchSortMasterAsset.sortOrder=event.sortOrder;
    this.SearchSortMasterAsset.sortFiled=event.sortField;
      this.masterAssetService.GetListMasterAssets(event.first, event.rows,this.SearchSortMasterAsset).subscribe((items) => {
      this.lstMasterAssets = items.results;     
      this.count = items.count;
       this.isLoading = false;
       this.ngxService.stop('loading');
    },error=>{
      this.isLoading = false;
    }
    );
}
  onSearch() {
    if( this.SearchSortMasterAsset.brandId === 0 &&
      this.SearchSortMasterAsset.originId === 0 &&
      this.SearchSortMasterAsset.categoryId === 0 &&
      this.SearchSortMasterAsset.subCategoryId === 0 &&
      (this.SearchSortMasterAsset.modelNumber === "" || this.SearchSortMasterAsset.modelNumber === null) &&
      (this.SearchSortMasterAsset.assetName === "" || this.SearchSortMasterAsset.assetName === null))
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
    this.first = 0;
    this.rows=10;
   this.ngxService.start('loading');
  //  this.SearchSortMasterAsset.modelNumber=this.SearchSortMasterAsset.modelNumber?.trim() ?? ''
  //  this.SearchSortMasterAsset.assetName=this.SearchSortMasterAsset.assetName?.trim() ?? ''
   this.masterAssetService.GetListMasterAssets(this.first,this.rows,this.SearchSortMasterAsset).subscribe((items) => {
      this.lstMasterAssets = items.results;
      this.count = items.count;
      this.ngxService.stop('loading');
    });
  }
  addMasterAsset() {
    const dialogRef2 = this.dialogService.open(CreateComponent, {
      header: this.lang == "en" ? 'Add Master Asset' : "بيان إضافة أصل جديد",
      width: '80%',
      style: {
        'dir': this.lang == "en" ? 'ltr' : "rtl",
        "text-align": this.lang == "en" ? 'left' : "right",
        "direction": this.lang == "en" ? 'ltr' : "rtl"
      }
    });
    dialogRef2.onClose.subscribe((Created) => {
     if(Created){
       this.LoadMasterAssets(this.reloadTableObj);
       this.dataTable.first=0;
      this.displaySuccessCreate  =true;
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
        this.masterAssetService.DeleteMasterAsset(masterAsset.id).subscribe(deleted => {
          this.LoadMasterAssets(this.reloadTableObj);
          this.dataTable.first=0;
        this.displaySuccessDelete=true;
        },
          (error) => {
            this.errorDisplay=true;
            this.errorMessage=`${this.lang == 'en'?`${error.error.message}`:`${error.error.messageAr}`}`;
      },)}})
  }
  editMasterAsset(id: number) {
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
  reload() {
    const currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
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
      (this.SearchSortMasterAsset.modelNumber === "" || this.SearchSortMasterAsset.modelNumber === null) &&
      (this.SearchSortMasterAsset.assetName === "" || this.SearchSortMasterAsset.assetName === null))
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
    this.SearchSortMasterAsset = null;
    this.lstMasterAssets = [];
    this.count = 0;
    this.reload();
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

