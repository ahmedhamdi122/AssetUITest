import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { LoggedUser } from '../../Models/userVM';
import { AuthenticationService } from './authentication.service';
import { SectionModulePermisisons } from '../../Models/Module';


@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    AuthorizedRoles;
    user: LoggedUser;
    public currentUser: LoggedUser;
    private SectionModulePermisisons:SectionModulePermisisons[];
    constructor(private router: Router,
        private authenticationService: AuthenticationService)
         {
            this.authenticationService.AllModulesPermissionsForCurrentUser$.subscribe(res=>this.SectionModulePermisisons=res)
          }



    canActivate(route: ActivatedRouteSnapshot,): boolean {
        if (this.authenticationService.isLogged()) {
            //console.log("route :",route.data['']);
            
            //this.authenticationService.hasModule('',this.SectionModulePermisisons)
            return true;
        }
        else {
            this.router.navigate(['']);
            return false;
        }
    }
}
