import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root', 
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    var userInfo = sessionStorage.getItem('UserInfo')
    if (userInfo != null) {
      return true;
    } else {
      this.router.navigate(['login-form']);
      return false;
    }
  }
}
