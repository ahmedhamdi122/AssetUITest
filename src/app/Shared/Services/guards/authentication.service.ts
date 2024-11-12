import { Router } from '@angular/router';

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../src/environments/environment';
import { LoggedUser, User } from '../../Models/userVM';
import { ModulesPermissionsResult, SectionModulePermisisons } from '../../Models/Module';
import { RequestStatus } from '../../Models/RequestStatusVM';


@Injectable({ providedIn: 'root' })
export class AuthenticationService {

    loggingUserObj: User;
    httpHeader = new HttpHeaders({
        'Accept': '*/*'
    });


    httpHeader2 = {
        headers: new HttpHeaders({
            'content-type': 'application/json',
            'Accept': '*/*'

        })
    };


    private currentUserSubject: BehaviorSubject<LoggedUser>;
    private currentUserCookieLogged: BehaviorSubject<LoggedUser>;
    private AllModulesPermissionsforcurrentUserSubject: BehaviorSubject<SectionModulePermisisons[]>;
    public AllModulesPermissionsForCurrentUser$:Observable<SectionModulePermisisons[]>; 
    public currentUser: Observable<LoggedUser>;
    public loggedUserCookie: Observable<LoggedUser>;
    lstRoleNames: string[] = [];
    cookieValue: string = "";
    public userName: string;
    constructor(private http: HttpClient, private router: Router) {


        this.currentUserSubject = new BehaviorSubject<LoggedUser>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();


        // if (this.currentUserCookieLogged != null || this.currentUserCookieLogged != undefined) {
        //     this.currentUserCookieLogged = new BehaviorSubject<LoggedUser>(JSON.parse(this.cookieService.get('usercookie')));
        //     this.loggedUserCookie = this.currentUserCookieLogged.asObservable();
        // }

    }
    hasPermission(requiredPermissions: string, moduleName: string,SectionModulePermisisons:SectionModulePermisisons[]): boolean {
      var module;
      return SectionModulePermisisons.some(s=>{
         module=s.moduleWithPermissionNames.find(m=> m.moduleName==moduleName)
         if(module)
         {
          var permissionsExists=module.permissionNames.find(pName=>pName==requiredPermissions);
       
          if(permissionsExists)
          {
            return true;
          }
          return false;
          
         }
      });
      }
      hasModule(moduleName: string,SectionModulePermisisons:SectionModulePermisisons[])
      {
        var module;
        return SectionModulePermisisons.some(s=>{
           module=s.moduleWithPermissionNames.find(m=> m.moduleName==moduleName)
           if(module)
           {
            return true;
           }
           return false;
        });
      }

    public get currentUserValue(): LoggedUser {
        return this.currentUserSubject.value;
    }
    public get currentUserCookieValue(): LoggedUser {
        return this.currentUserSubject.value;
    }

    public  setAllModulesPermissionsforcurrentUser(): void {
        this.AllModulesPermissionsforcurrentUserSubject=new BehaviorSubject<SectionModulePermisisons[]>([]);
        //make api to get modules
        this.AllModulesPermissionsforcurrentUserSubject.next( [
            {
              icon: "pi pi-home", 
              sectionName: "Dashboard",
              sectionNameAr: "الصفحة الرئيسية",
              moduleWithPermissionNames: []
            },
            {
              icon: "pi pi-sitemap", 
              sectionName: "Structure",
              sectionNameAr: "الهيكل الهرمي",
              moduleWithPermissionNames: [
                {
                  icon: "pi pi-flag-fill",
                  route: "governorates",
                  moduleName: "Governorate",
                  moduleNameAr: "المحافظات",
                  permissionNames: ["add", "edit", "delete"],
                },
                {
                  icon: "pi pi-sitemap",
                  route: "organizations",
                  moduleName: "Organization",
                  moduleNameAr: "الهيئات",
                  permissionNames: ["add", "delete"],
                },
                {
                  icon: "pi pi-warehouse",
                  route: "hospitals",
                  moduleName: "Hospitals",
                  moduleNameAr: "المستشفيات",
                  permissionNames: ["delete"],
                },
                {
                  icon: "pi pi-building",
                  route: "buildings",
                  moduleName: "Buildings",
                  moduleNameAr: "المباني",
                  permissionNames: ["add", "delete"],
                },
                {
                  icon: "pi pi-sitemap",
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
                  permissionNames: [ 
                    "edit",
                     "view",
                    "add" ,
                    "delete"
                  ],
                },
                {
                  icon: "",
                  route: "hospitalassets",
                  moduleName: "Hospital Assets",
                  moduleNameAr: "أصول المستشفى",
                  permissionNames: [
                    "add", 
                    "delete",
                    "edit",
                    "view"
                  ],
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
                  permissionNames: ["delete","view"],
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
              icon: "pi pi-wrench",  
              sectionName: "Maintainance",
              sectionNameAr: "الصيانة",
              moduleWithPermissionNames: [
                {
                  icon: "pi pi-ticket",
                  route: "servicerequests",
                  moduleName: "Requests",
                  moduleNameAr: "طلبات",
                  permissionNames: ["add", "edit", "delete"],
                },
                {
                  icon: "pi pi-cog",
                  route: "workorders",
                  moduleName: "Work Orders",
                  moduleNameAr: "أوامر الشغل",
                  permissionNames: ["add", "edit", "delete"],
                }
              ]
            },
            {
              icon: "pi pi-settings",  
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
          ]
        );
        this.AllModulesPermissionsForCurrentUser$=this.AllModulesPermissionsforcurrentUserSubject.asObservable()
    }

    login(userObj: User): Observable<LoggedUser> {
        return this.http.post<LoggedUser>(`${environment.Login}`, userObj, { headers: this.httpHeader })
            .pipe(map(user => {
                localStorage.setItem('lang', "ar");
                localStorage.setItem('dir', "rtl");
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
                // if (userObj.isRemembered) {
                //     this.currentUserValue.isRemembered = true;
                //    user.isRemembered = true;
                //     localStorage.setItem('rememberCurrentUser',   user.isRemembered.toString());
                //     this.cookieService.set('usercookie', JSON.stringify(user));
                // } else {
                //     this.currentUserValue.isRemembered = false;
                //     user.isRemembered = false;
                //     localStorage.setItem('rememberCurrentUser',  user.isRemembered.toString());
                //     localStorage.setItem('currentUser', JSON.stringify(user));
                // }
                return user;
            }));
    }


   
    isLogged() {
        // const cookieExists: boolean = this.cookieService.check('usercookie');
        // if (cookieExists) {
        //     this.currentUser = JSON.parse(this.cookieService.get('usercookie'));
        //     this.currentUser["roleNames"].forEach(element => {
        //         this.lstRoleNames.push(element["name"]);
        //     });
        //     return !!this.cookieService.get('usercookie');
        // }

        const user = localStorage.getItem("currentUser");
        if (user) {
            this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
            // this.currentUser["roleNames"].forEach(element => {
            //     this.lstRoleNames.push(element["name"]);
            // });

            return !!localStorage.getItem("currentUser");
        }
        return false
    }

    logout() {
        localStorage.removeItem('currentUser');
        localStorage.setItem('rememberCurrentUser', 'false');
        // localStorage.clear();
        this.userName = "";
        this.currentUserSubject.next(null);
        // this.cookieService.delete('usercookie');
        // this.cookieService.deleteAll();
        // localStorage.setItem('lang', "en");
        // localStorage.setItem('dir', "ltr");
        this.router.navigate(['/']);

    }

    validateMacAddress(): Observable<boolean> {
        return this.http.get<boolean>(`${environment.getMacAddress}`, this.httpHeader2);
    }


    
    validateMBSerial(): Observable<boolean> {
        return this.http.get<boolean>(`${environment.getMBSerial}`, this.httpHeader2);
    }
}