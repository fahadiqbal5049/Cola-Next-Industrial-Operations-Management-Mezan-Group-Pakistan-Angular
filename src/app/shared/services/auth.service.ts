import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router, CanActivate, CanActivateChild, ActivatedRouteSnapshot } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../enironments/environment';
const defaultPath = '/';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _user = User;
  get loggedIn(): boolean {
    return false;
  }
  public selectedMenu = new BehaviorSubject<boolean>(true);

  setMenu(i: any) {
    this.selectedMenu.next(i)
  }
  getMenu() {
    return this.selectedMenu.value
  }
  private canActivateSubject = new BehaviorSubject<boolean>(false);
  canActivateMenue$ = this.canActivateSubject.value;

  setCanActivate(value: boolean) {
    this.canActivateSubject.next(value);
  }
  readonly url = environment.url;
  readonly rootUrl = environment.baseUrl;
  user!: any;

  private _lastAuthenticatedPath: string = defaultPath;
  set lastAuthenticatedPath(value: string) {
    this._lastAuthenticatedPath = value;
  }

  constructor(private router: Router, private http: HttpClient) {
    if (sessionStorage.getItem('UserInfo') !== null) {
      var t = sessionStorage.getItem('UserInfo')
      this.user = JSON.parse(t!)
      // console.log(t);
      // console.log(this.user);
    }

    // setTimeout(() => {
    //   this.user = (sessionStorage.getItem('UserInfo'));
    //   console.log(this.user);
    // }, 1000)

  }

  logIn(email: string, password: string) {

    // Send request
    const data = { USER_EMAIL: email, PASSWORD: password };
    const reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.rootUrl + '/api/Auth/Login', data, { headers: reqHeader });
    // this._user = { ...defaultUser, email };
    // this.router.navigate([this._lastAuthenticatedPath]);

    // return {
    //   isOk: true,
    //   data: this._user
    // };

  }
  getSecurityData(SecurityGroupId: number, Module: string) {
    let prams = new HttpParams()
      .set("SecurityID", SecurityGroupId)
      .set("ModuleName", Module)
    return this.http.get<any[]>(this.rootUrl + '/api/Login/GetSecurity', { params: prams });
  }

  getSecurityDataForBlockedComponent(SecurityGroupId: number, ComponentName: string) {
    let prams = new HttpParams()
      .set("SecurityId", SecurityGroupId)
      .set("Component_Name", ComponentName)
      console.log(SecurityGroupId)
      var obj={
        "SecurityId":parseInt(SecurityGroupId.toString()) ,
        "Component_Name": ComponentName
      }
      // console.log(obj)
    return this.http.post<any[]>(this.url + '/api/ModuleConfiguration/GetBlockedComponentAgainstSecurity',obj);
  }

  async getUser() {
    try {
      // Send request

      return {
        isOk: true,
        data: this._user
      };
    }
    catch {
      return {
        isOk: false
      };
    }
  }

  async createAccount(email: any, password: any) {
    try {
      // Send request
      console.log(email, password);

      this.router.navigate(['/create-account']);
      return {
        isOk: true
      };
    }
    catch {
      return {
        isOk: false,
        message: "Failed to create account"
      };
    }
  }

  async changePassword(email: string, recoveryCode: string) {
    try {
      // Send request
      console.log(email, recoveryCode);

      return {
        isOk: true
      };
    }
    catch {
      return {
        isOk: false,
        message: "Failed to change password"
      }
    };
  }

  async resetPassword(email: string) {
    try {
      // Send request
      console.log(email);

      return {
        isOk: true
      };
    }
    catch {
      return {
        isOk: false,
        message: "Failed to reset password"
      };
    }
  }

  logOut() {
    sessionStorage.clear();
    // this._user = null;
    this.user = null;
    this.router.navigate(['/login-form']);
  }

  getToken(): any {
    return sessionStorage.getItem('userToken') !== null ? sessionStorage.getItem('userToken') : '';
  }
  employeeType(): any {
    return this.user != null ? this.user.EMPLOYEE_TYPE : '';
  }
  getUserEmail(): string {
    return this.user != null ?this.user.USER_EMAIL:'';
    // return "augit@gmail.com";

  }
  getGroupName(): string {
    // console.log(this.user.GROUP_NAME)
    return this.user.USER_NAME;
  }

  getUserId(): any {
    return this.user.SEQ_ID;
  }
  currentUserId(): any {
		return this.user != null ? parseInt(this.user.SEQ_ID.toString()) : null;
	}

  getSecurityGroup(): number {
    console.log(this.user)
    return this.user != null ?this.user.SEQ_ID:0;
  }
  getDepartmentname(): string {
    return this.user.DEPARTMENT_NAME;
  }

  getDepartmentId(): number {
    return this.user.DepartmentsSeqId;
  }

  getUserName(): string {
    return this.user != null ?this.user.EMPLOYEE_NAME:'';
  }

  currentSubUserName(): any {
    let shortName = '';
    if (this.user != null) {
      shortName = this.user.EMPLOYEE_NAME.substring(0, 2);
    }
    return shortName;
  }
  isUserEmailLoggedIn(): boolean {
    if (this.getToken() !== '') {
      return true;
    } else {
      return false;
    }
  }
}

@Injectable()
export class AuthGuardService implements CanActivate, CanActivateChild {
  constructor(private router: Router, private authService: AuthService) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // return true;
    if (this.authService.getGroupName() == 'Production') {
      return false
    } else {
      // notify('Your Area Not Allowed', 'error');

      return true
    }
  }

  canActivateChild(route: ActivatedRouteSnapshot): boolean {
    return true;
  }
}
