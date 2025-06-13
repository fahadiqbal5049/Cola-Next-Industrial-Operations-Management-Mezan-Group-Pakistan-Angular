import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { environment } from '../../enironments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  readonly rootUrl = environment.baseUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders() {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  getData(): Observable<any> {
    return this.http.get<any>(this.rootUrl + '/api/Employee/GetEmployees', {
      headers: this.getHeaders(),
    });
  }

  addUser(obj: UserModel): Observable<UserModel> {
    obj.Type = 'Save';
    obj.CREATED_BY = this.authService.getUserId();
    return this.http.post<UserModel>(
      this.rootUrl + '/api/Employee/CreateEmployee',
      obj,
      { headers: this.getHeaders() }
    );
  }

  updateUser(obj: Partial<UserModel>): Observable<UserModel> {
    const formattedData = {
      SEQ_ID: Number(obj.SEQ_ID),
      AUG_SECURITY_GROUP_SEQ_ID: Number(obj.AUG_SECURITY_GROUP_SEQ_ID),
      EMPLOYEE_NAME: obj.EMPLOYEE_NAME,
      USER_NAME: obj.USER_NAME,
      STATUS: obj.STATUS,
      USER_EMAIL: obj.USER_EMAIL,
      DESIGNATION: obj.DESIGNATION,
      ACTIVE: Number(obj.ACTIVE),
      MODIFIED_BY: Number(this.authService.getUserId()),
    };

    console.log('Formatted Data:', formattedData);

    return this.http.patch<UserModel>(
      this.rootUrl + '/api/Employee/UpdateEmployee',
      formattedData,
      { headers: this.getHeaders() }
    );
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.rootUrl}/api/Employee/DeleteEmployee?id=${id}`, {
      headers: this.getHeaders(),
      responseType: 'text'
    });
  }
}

export class UserModel {
  SEQ_ID!: number;
  AUG_SECURITY_GROUP_SEQ_ID!: number;
  PASSWORD_HASH!: string | null;
  USER_NAME!: string;
  USER_EMAIL!: string;
  GROUP_DESCRIPTION!: string | null;
  ACTIVE!: number;
  GROUP_NAME!: string | null;
  PASSWORD!: string;
  TableName!: string;
  PASSWORD_SALT!: string | null;
  CREATED_DATE!: string;
  EMPLOYEE_NAME!: string;
  STATUS!: string;
  DESIGNATION!: string;
  Type!: string;
  CREATED_BY!: number;
  MODIFIED_BY!: number;
}
