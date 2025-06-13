// import { Injectable } from '@angular/core';
// import { HttpClient ,HttpParams} from '@angular/common/http';
// import { environment } from '../../enironments/environment';
// import { AuthService } from './auth.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class SecurityGroupService {
//   readonly rootUrl = environment.baseUrl;
//   constructor(private http: HttpClient,private authService:AuthService) { }

//   getData(){
//     return this.http.get<SecurityGroup[]>(this.rootUrl + '/api/SecurityGroup/GetSecurityGroups');
//   }

//   addSecurityGroup(obj:any){
//     // obj["CreatedBy"] = this.authService.getUserId();
//     obj["Type"] = 'Save';
//     return this.http.post(this.rootUrl + '/api/SecurityGroup/UpdateSecurityGroup', obj);
//   }

//   updateSecurityGroup(obj:any){
//     obj["Type"] = 'Update';
//     return this.http.post(this.rootUrl + '/api/SecurityGroup/UpdateSecurityGroup', obj);
//   }

//   deleteSecurityGroup(id:any){

//     const body = new HttpParams().set('seqId',id ).set('Userid',this.authService.getUserId());
//     return this.http.get<any[]>(this.rootUrl + '/api/Configuration/DeleteSecurityGroup',{params:body});
//   }

// }

// export class SecurityGroup {
//   SeqId!: number;
//   GroupName!: string;
//   GroupDescription!: string;
// }


import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../enironments/environment';
import { AuthService } from './auth.service';
import { SecurityGroup } from '../models/security-group.model';

@Injectable({
  providedIn: 'root'
})
export class SecurityGroupService {
  readonly rootUrl = environment.baseUrl;
  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders() {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getData() {
    return this.http.get<SecurityGroup[]>(this.rootUrl + '/api/SecurityGroup/GetAllSecurityGroup', { headers: this.getHeaders() });
  }

  addSecurityGroup(obj: SecurityGroup) {
    obj['CREATED_BY'] = this.authService.getUserId();
    obj['ACTIVE'] = true;
    obj['Type'] = 'Save';
    return this.http.post<SecurityGroup[]>(this.rootUrl + '/api/SecurityGroup/CreateSecurityGroup', obj, { headers: this.getHeaders() });
  }

  updateSecurityGroup(obj: SecurityGroup) {
    obj['MODIFIED_BY'] = this.authService.getUserId();
    obj['Type'] = 'Update';
    return this.http.patch<SecurityGroup[]>(this.rootUrl + '/api/SecurityGroup/UpdateSecurityGroup', obj, { headers: this.getHeaders() });
  }

  deleteSecurityGroup(id: number) {
    const body = new HttpParams().set('seqId', id).set('Userid', this.authService.getUserId());
    return this.http.get<any[]>(this.rootUrl + '/api/Configuration/DeleteSecurityGroup', { params: body, headers: this.getHeaders() });
  }
}
