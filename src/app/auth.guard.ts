import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from '@angular/router';


@Injectable({
    providedIn: 'root', // <--- This is essential
})

export class AuthGuard implements CanActivate {

    constructor(private router: Router, private route: ActivatedRoute) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (localStorage.getItem("token") == "success") {
            return true;
        }
        this.router.navigate(["/logout"]);
        return false;

    }
}