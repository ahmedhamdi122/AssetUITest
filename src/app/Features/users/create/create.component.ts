import { Component, OnInit } from '@angular/core';
import { ListRoleCategoriesVM } from 'src/app/Shared/Models/rolecategoryVM';
import { EditRoleVM, ListRolesVM } from 'src/app/Shared/Models/roleVM';
import {
  CreateUserVM,
  selectedHospitalType,
} from 'src/app/Shared/Models/userVM';
import { RoleService } from 'src/app/Shared/Services/role.service';
import { RoleCategoryService } from 'src/app/Shared/Services/rolecategory.service';
import { ListOrganizationVM } from 'src/app/Shared/Models/organizationVM';
import { ListSubOrganizationVM } from 'src/app/Shared/Models/subOrganizationVM';
import { ListGovernorateVM } from 'src/app/Shared/Models/governorateVM';
import { ListCityVM } from 'src/app/Shared/Models/cityVM';
import { OrganizationService } from 'src/app/Shared/Services/organization.service';
import { SubOrganizationService } from 'src/app/Shared/Services/subOrganization.service';
import { CityService } from 'src/app/Shared/Services/city.service';
import { GovernorateService } from 'src/app/Shared/Services/governorate.service';
import { HospitalService } from 'src/app/Shared/Services/hospital.service';
import { ListHospitalVM } from 'src/app/Shared/Models/hospitalVM';
import { UserService } from 'src/app/Shared/Services/user.service';
import { Router } from '@angular/router';
import { EmployeeService } from 'src/app/Shared/Services/employee.service';
import { ListEmployeeVM } from 'src/app/Shared/Models/employeeVM';
import { SupplierService } from 'src/app/Shared/Services/supplierService.service';
import { ListSupplierVM } from 'src/app/Shared/Models/supplierVM';
import { CommetieeMemberService } from 'src/app/Shared/Services/commetieeMember.service';
import { ListCommetieeMemberVM } from 'src/app/Shared/Models/commetieeMemberVM';
import { ListEngineerVM } from 'src/app/Shared/Models/engineerVM';
import { EngineerService } from './../../../Shared/Services/engineer.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogService } from 'primeng/dynamicdialog';
import { forkJoin } from 'rxjs';
import { CreateRoleComponent } from '../../roles/create/create.component';


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit {

  lang = localStorage.getItem('lang');
  userObj: CreateUserVM;
  lstRoleCategories: ListRoleCategoriesVM[];
  lstRoles: ListRolesVM[];
  lstUnregisteredEngineers: ListEngineerVM[] = [];
  lstRoles2: ListRolesVM[];

  editRole: EditRoleVM;
  lstEditRoles: EditRoleVM[] = [];


  addRoles: string[] = [];
  lstGovernorates: ListGovernorateVM[];
  lstCities: ListCityVM[];
  lstOrganizations: ListOrganizationVM[];
  lstSubOrganizations: ListSubOrganizationVM[];
  lstHospitals: ListHospitalVM[] = [];
  lstUnregisteredUsers: ListEmployeeVM[] = [];
  lstSuppliers: ListSupplierVM[] = [];
  lstMembers: ListCommetieeMemberVM[] = [];

  lstHospitalTypes: selectedHospitalType[];

  selectedCategory: number;
  selectedHospitalType: any;
  errorMessage: string;
  errorDisplay: boolean = false;
  display: boolean = false;
  displayerror: boolean = false;
  showGov: boolean = false;
  showCity: boolean = false;
  showOrg: boolean = false;
  showSubOrg: boolean = false;
  showHospitals: boolean = false;
  showRadioHospitals: boolean = false;
  showEmployees: boolean = false;
  showRoles: boolean = false;
  showSuppliers: boolean = false;
  showMembers: boolean = false;
  showVisits: boolean = false;
  displaySuccessCreate=false;
  constructor(
    private roleCategoryService: RoleCategoryService,
    private roleService: RoleService,
    private organizationService: OrganizationService,
    private subOrganizationService: SubOrganizationService,
    private cityService: CityService,
    private governorateService: GovernorateService,
    private hospitalService: HospitalService,
    private userService: UserService,
    private employeeService: EmployeeService,
    private supplierService: SupplierService,
    private commetieeMemberService: CommetieeMemberService,
    private route: Router,
    private engineerService: EngineerService,
    private spinner:NgxSpinnerService,private rolecategoryService:RoleCategoryService,private dialogService: DialogService
  ) { }

  ngOnInit(): void {
    
    this.userObj = {
      roleIds: [],
   roleCategoryId: 0, cityId: null, subOrganizationId: 0, governorateId: null, organizationId: 0, hospitalId: null, email: null, phoneNumber: '', password: '', userName: '',
    };
    if (this.lang == "en") {
      this.lstHospitalTypes = [
        { name: 'Get hospitals by City', id: 1 },
        { name: 'Get hospitals by Organization', id: 2 },
      ];
    }
    else {
      this.lstHospitalTypes = [
        { name: 'المستشفيات بالمدينة', id: 1 },
        { name: 'المستشفيات بالهيئات', id: 2 },
      ];
    }

    this.roleCategoryService.GetRoleCategories().subscribe((items) => {
      this.lstRoleCategories = items;
      this.selectedCategory = this.lstRoleCategories[0].id;
      this.roleService.GetRolesByRoleCategoryId(Number(this.selectedCategory)).subscribe((roles) => {
          this.lstRoles = roles;
          this.lstRoles2 = roles;
        });
    });

    this.governorateService.GetGovernorates().subscribe((items) => {
      
      this.lstGovernorates = items;
      console.log("this.lstGovernorates :",this.lstGovernorates);
      
    });

    this.organizationService.GetOrganizations().subscribe((items) => {
      this.lstOrganizations = items;

    });
  

    // if (this.userObj.hospitalId > 0) {
    //   //  this.getUnregisteredEmployees(this.userObj.hospitalId);
    // }


    this.engineerService.GetUnregisteredEngineerUsers().subscribe(usrs => {
      this.lstUnregisteredEngineers = usrs;
    })
  }

  addRole()
  {
    this.spinner.show();
    var rolecategoryReq=this.rolecategoryService.GetRoleCategories();
    forkJoin([rolecategoryReq]).subscribe(
      {
        next:rolecategoryRes=>{
          this.spinner.hide();
          const dialogRef = this.dialogService.open(CreateRoleComponent, {
            header: this.lang == "en" ? 'Add Role ' : "إضافة دور",
            width: '70%',
            data:rolecategoryRes,
            style: {
              'dir': this.lang == "en" ? 'ltr' : "rtl",
              "text-align": this.lang == "en" ? 'left' : "right",
              "direction": this.lang == "en" ? 'ltr' : "rtl"
            }
          });
              dialogRef.onClose.subscribe((CreateRole) => {
            if(CreateRole)
            {
              this.spinner.hide();
                 this.displaySuccessCreate=true;
              }
      
          
        })
      },error:err=>{

        }})
  }

  onTypeChange($event) {
    
    let typeId = $event.value;
    this.selectedHospitalType = typeId;
    if (typeId == 1) {
      this.showGov = true;
      this.showCity = true;
      this.showOrg = false;
      this.showSubOrg = false;
      this.showHospitals = true;
    }
    if (typeId == 2) {
      this.showGov = false;
      this.showCity = false;
      this.showOrg = true;
      this.showSubOrg = true;
      this.showHospitals = true;
    }
  }

  onRoleChange($event) {    
    this.addRoles=[];
    this.spinner.show();
    this.roleService.GetRolesByRoleCategoryId(Number($event.value)).subscribe((roles) => {
      this.spinner.hide();
        this.lstRoles = roles;
        this.lstRoles2 = roles;
      });

    if ($event.value == '1') {
      this.showGov = false;
      this.showCity = false;
      this.showOrg = false;
      this.showSubOrg = false;
      this.showHospitals = false;
      this.showEmployees = false;
      this.showMembers = false;
      this.showSuppliers = false;
      this.showVisits = false;
      this.showRadioHospitals = false;

    }

    if ($event.value == '2') {
      this.showGov = false;
      this.showCity = false;
      this.showOrg = true;
      this.showSubOrg = false;
      this.showHospitals = false;
      this.showEmployees = false;
      this.showMembers = false;
      this.showSuppliers = false;
      this.showVisits = false;

    }
    if ($event.value == '3') {
      this.showGov = true;
      this.showCity = false;
      this.showOrg = false;
      this.showSubOrg = false;
      this.showHospitals = false;
      this.showEmployees = false;
      this.showMembers = false;
      this.showSuppliers = false;
      this.showVisits = false;


    }

    if ($event.value == '4') {
      this.showGov = true;
      this.showCity = true;
      this.showOrg = false;
      this.showSubOrg = false;
      this.showHospitals = false;
      this.showEmployees = false;
      this.showRoles = true;
      this.showMembers = false;
      this.showSuppliers = false;
      this.showVisits = false;

    }

    if ($event.value == '5') {
      
      this.selectedHospitalType = 1;
      this.showGov = true;
      this.showCity = true;
      this.showOrg = false;
      this.showSubOrg = false;
      this.showHospitals = true;
      this.showRadioHospitals = true;
      this.showEmployees = true;
      this.showRoles = true;
      this.showMembers = false;
      this.showSuppliers = false;
      this.showVisits = false;

    }

    if ($event.value == '6') {
      this.selectedHospitalType = 1;
      this.showGov = false;
      this.showCity = false;
      this.showOrg = true;
      this.showHospitals = false;
      this.showSubOrg = true;
      this.showRadioHospitals = false;
      this.showEmployees = false;
      this.showSuppliers = false;
      this.showVisits = false;


    }

    if ($event.value == '7') {
      this.showGov = false;
      this.showCity = false;
      this.showOrg = false;
      this.showSubOrg = false;
      this.showHospitals = false;
      this.showEmployees = false;
      this.showRoles = false;
      this.showSuppliers = true;
      this.showMembers = false;
      this.showVisits = false;

    }
    if ($event.value == '8') {

      this.showGov = false;
      this.showCity = false;
      this.showOrg = false;
      this.showSubOrg = false;
      this.showHospitals = false;
      this.showEmployees = false;
      this.showSuppliers = false;
      this.showMembers = true;
      this.showVisits = false;

    }
    if ($event.value == '9') {

      this.showGov = false;
      this.showCity = false;
      this.showOrg = false;
      this.showSubOrg = false;
      this.showHospitals = false;
      this.showEmployees = false;
      this.showSuppliers = false;
      this.showMembers = false;
      this.showVisits = true;
    }
  }
  changeUnregiteredValue($event) {
    if($event.value!=null)
    {
      console.log("  $event.value :", $event.value);
      const email = $event.value;
      this.userObj.email = email;
      this.userObj.userName = this.userObj.email.split('@')[0].trim();
    }
    else
    {
      console.log("null inside changeUnregiteredValue");
      
      this.userObj.email = null;
      this.userObj.userName =null;
    }

  }

  getEmployeesByHospitalId(hospitalId:number) {
    console.log("getEmployeesByHospitalId :",hospitalId);
    if(hospitalId)
    {
      this.spinner.show();
      this.employeeService.GetUnregisteredUsers(hospitalId).subscribe((items) => {
        this.lstUnregisteredUsers = items;
        console.log("lstUnregisteredUsers :",this.lstUnregisteredUsers);
        this.spinner.hide();
      });
    }
    else
    {
      this.lstUnregisteredUsers =null;
      this.userObj.hospitalId=null;
      this.userObj.email=null;
      this.lstUnregisteredUsers=null;
      this.userObj.userName=null;
      this.userObj.password=null;
    }
   
  }
  getGovernorateLabel(governorate: any) {
    return this.lang === 'ar' ? governorate.nameAr : governorate.nameEn;
  }
  getCitiesByGovId(govId: number) {
    console.log("govId :",govId);
    if(govId!=null)
    {
      this.spinner.show();
      this.cityService.GetCitiesByGovernorateId(govId).subscribe((cities) => {
        this.lstCities = cities;
        console.log("lstCities :",this.lstCities);
        this.spinner.hide();
      });
    }
    else{
      this.lstCities=null;
      this.userObj.cityId=null;
      this.lstHospitals=null;
      this.userObj.hospitalId=null;
      this.userObj.email=null;
      this.lstUnregisteredUsers=null;
      this.userObj.userName=null;
      this.userObj.password=null;
    }
  
  }
  getHospitalsByCityId(cityId:number) {
    console.log("cityId :", cityId);
    if(cityId!=null)
    {
      this.spinner.show();
      this.hospitalService.GetHospitalsByCityId(cityId).subscribe((hospitals) => {
          this.lstHospitals = hospitals;
          console.log("lstHospitals :",this.lstHospitals);
          this.spinner.hide();
        });
    }
    else
    {
      this.lstHospitals=null;
      this.userObj.hospitalId=null;
      this.userObj.email=null;
      this.lstUnregisteredUsers=null;
      this.userObj.userName=null;
      this.userObj.password=null;
    }
   
  }
  getSubOrgByOrgId($event) {
    this.spinner.show();
    this.subOrganizationService.GetSubOrganizationByOrgId($event.target.value).subscribe((suborgs) => {
        this.lstSubOrganizations = suborgs;        
        this.spinner.hide();
      });
  }

  getHospitalsBySubOrgId($event) {
    this.spinner.show();
    this.hospitalService.GetHospitalsBySubOrganizationId($event.target.value).subscribe((hospitals) => {
        this.lstHospitals = hospitals;
        this.spinner.hide();
      });
  }

  onSubmit() {
    console.log("this.addRoles :",this.addRoles);
    console.log("this.addRoleslength :", this.addRoles.length);
    this.userObj.roleCategoryId = this.selectedCategory;
    this.userObj.roleIds = this.addRoles;
    if (this.addRoles.length == 0) {
      console.log("this.addRoles inside:", this.addRoles);
      this.errorDisplay = true;
      if (this.lang == "en") {
        this.errorMessage = 'Please select at least one Role';
      }
      else {
        this.errorMessage = 'من فضلك اختر أحد المهام';
      }
      return false;
    }
    if (this.selectedCategory == 1) {
      this.userObj.roleIds = this.addRoles;
      this.spinner.show();
      this.userService.AddUser(this.userObj).subscribe((user) => {
        this.spinner.hide();
        this.display = true;
      },
        error => {
          this.spinner.hide();
          console.log("error :",error);
          
          this.errorDisplay = true;
          if (this.lang == 'en') {
            if (error.error.status == 'Error') {
              this.errorMessage = error.error.message;
            }
            else if(error.error.status =="UserExists")
            {
              this.errorMessage = error.error.message;
            }
          }
          else {
            if (error.error.status == 'Error') {
              this.errorMessage = error.error.messageAr;
            }
            else if(error.error.status =="UserExists")
              {
                this.errorMessage = error.error.messageAr;
              }
          }
          return false;
        });
    }
    // else if (this.selectedCategory == 2) {
    //   if (this.userObj.organizationId == 0) {
    //     alert('Please select organization');
    //     return false;
    //   }
    //   else {
    //     this.userObj.roleIds = this.addRoles;
    //     this.userService.AddUser(this.userObj).subscribe((user) => {
    //       this.display = true;
    //     }, error => {
    //       this.errorDisplay = true;
    //       this.errorMessage = error.error.message;
    //       return false;
    //     });
    //   }
    // }
    // else if (this.selectedCategory == 3) {
    //   if (this.userObj.governorateId == 0) {
    //     this.errorDisplay = true;
    //     this.errorMessage = "Please select governorate";
    //     return false;
    //   } else {

    //     this.userObj.roleIds = this.addRoles;
    //     this.userService.AddUser(this.userObj).subscribe((user) => {
    //       this.display = true;
    //     }, error => {
    //       this.displayerror = true;
    //       this.errorMessage = error.error.message;
    //       return false;
    //     });
    //   }
    // }
    // else if (this.selectedCategory == 4) {
    //   if (this.userObj.governorateId == 0) {
    //     this.errorDisplay = true;
    //     this.errorMessage = 'Please select governorate';
    //     return false;
    //   }
    //   if (this.userObj.cityId == 0) {
    //     this.errorDisplay = true;
    //     this.errorMessage = 'Please select city';
    //     return false;
    //   } else {

    //     this.userObj.roleIds = this.addRoles;
    //     this.userService.AddUser(this.userObj).subscribe((user) => {
    //       this.display = true;
    //     }, error => {
    //       this.errorDisplay = true;
    //       this.errorMessage = error.error.message;
    //       return false;
    //     });
    //   }
    // }
    // else if (this.selectedCategory == 5) {
    //   if (this.selectedHospitalType == 1) {
    //     if (this.userObj.governorateId == 0) {
    //       this.errorDisplay = true;
    //       this.errorMessage = 'Please select governorate';
    //       return false;
    //     }
    //     if (this.userObj.cityId == 0) {
    //       this.errorDisplay = true;
    //       this.errorMessage = 'Please select city';
    //       return false;
    //     } else {
    //       this.userObj.roleIds = this.addRoles;
    //       this.userService.AddUser(this.userObj).subscribe((user) => {
    //         this.display = true;
    //       }, error => {
    //         this.errorDisplay = true;
    //         this.errorMessage = error.error.message;
    //         return false;
    //       });
    //     }
    //   }

    //   if (this.selectedHospitalType == 2) {
    //     if (this.userObj.organizationId == 0) {
    //       this.errorDisplay = true;
    //       if (this.lang == "en") {
    //         this.errorMessage = 'Please select Organization';
    //       } else {
    //         this.errorMessage = 'من فضلك اختر هيئة';
    //       }
    //       return false;
    //     }
    //     if (this.userObj.subOrganizationId == 0) {
    //       this.errorDisplay = true;
    //       if (this.lang == "en") {
    //         this.errorMessage = 'Please select sub Organization';
    //       }
    //       else {
    //         this.errorMessage = 'من فضلك اختر هيئة فرعية';
    //       }
    //       return false;
    //     } else {

    //       this.userObj.roleIds = this.addRoles;
    //       this.userService.AddUser(this.userObj).subscribe((user) => {
    //         this.display = true;
    //       }, error => {
    //         this.errorDisplay = true;
    //         this.errorMessage = error.error.message;
    //         return false;
    //       });
    //     }
    //   }
    // }
    // else if (this.selectedCategory == 6) {

    //   if (this.userObj.organizationId == 0) {
    //     this.errorDisplay = true;
    //     if (this.lang == "en") {
    //       this.errorMessage = 'Please select Organization';
    //     } else {
    //       this.errorMessage = 'من فضلك اختر هيئة';
    //     }
    //     return false;
    //   }
    //   if (this.userObj.subOrganizationId == 0) {
    //     this.errorDisplay = true;
    //     if (this.lang == "en") {
    //       this.errorMessage = 'Please select sub Organization';
    //     }
    //     else {
    //       this.errorMessage = 'من فضلك اختر هيئة فرعية';
    //     }
    //     return false;
    //   } else {

    //     this.userObj.roleIds = this.addRoles;
    //     this.userService.AddUser(this.userObj).subscribe((user) => {
    //       this.display = true;
    //     }, error => {
    //       this.errorDisplay = true;
    //       this.errorMessage = error.error.message;
    //       return false;
    //     });
    //   }

    // }
  }

}
