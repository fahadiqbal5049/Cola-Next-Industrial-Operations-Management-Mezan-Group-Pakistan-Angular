// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { AuthService } from './auth.service';
// import { environment } from '../../enironments/environment';

// @Injectable({
// 	providedIn: 'root'
// })
// export class UnitsService {
// 	readonly rootUrl = environment.baseUrl;

// 	constructor(private http: HttpClient, private authSer: AuthService) {}

// 	getRecord() {
// 		return this.http.get<Units[]>(this.rootUrl + '/api/Units/GetUnits');
// 	}
// 	insert(obj: Units) {
// 		const id = this.authSer.currentUserId();
// 		obj['CREATED_BY'] = id;
// 		obj['ACTIVE'] = true;
// 		obj['Type'] = 'Save';
// 		return this.http.post<Units[]>(this.rootUrl + '/api/Units/UpdateUnits', obj);
// 	}
// 	update(obj: Units) {
// 		const id = this.authSer.currentUserId();
// 		obj['MODIFIED_BY'] = id;
// 		obj['Type'] = 'Update';
// 		return this.http.post<Units[]>(this.rootUrl + '/api/Units/UpdateUnits', obj);
// 	}

// }

// export class Units {
//   SEQ_ID!:	number	;
//   UNIT_NAME !: string	;
//   UNIT_DESCRIPTION!: string	;
//   ACTIVE !: boolean;
//   CREATED_DATE!: string	;
//   CREATED_BY!:	number	;
//   MODIFIED_DATE!: string	;
//   MODIFIED_BY!:number	;
//   Type?: string;
//   }


import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../enironments/environment';

@Injectable({
  providedIn: 'root'
})
export class UnitsService {
  readonly rootUrl = environment.baseUrl;

  constructor(private http: HttpClient, private authSer: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authSer.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getRecord(): Observable<Units[]> {
    return this.http.get<Units[]>(this.rootUrl + '/api/Units/GetAllUnits', { headers: this.getHeaders() });
  }

  insert(obj: Units): Observable<Units[]> {
    const id = this.authSer.currentUserId();
    obj['CREATED_BY'] = id;
    obj['ACTIVE'] = true;
    obj['Type'] = 'Save';
    return this.http.post<Units[]>(this.rootUrl + '/api/Units/CreateUnits', obj, { headers: this.getHeaders() });
  }

  update(obj: Units): Observable<Units[]> {
    const id = this.authSer.currentUserId();
    obj['MODIFIED_BY'] = id;
    obj['Type'] = 'Update';
    return this.http.patch<Units[]>(this.rootUrl + '/api/Units/UpdateUnits', obj, { headers: this.getHeaders() });
  }
  // delete(id: number) {
  //   return this.http.delete<any[]>(this.rootUrl + '/api/Units/DeleteUnits?seqId=' + id, { headers: this.getHeaders() });
  // }
  delete(id: number) {
    return this.http.delete<any[]>(`${this.rootUrl}/api/Units/DeleteUnits?id=${id}`, {responseType: 'text' as 'json'});
  }
   checkDuplicateSku(name: string, names: Units[]) {
      return names.filter(t => t.UNIT_NAME === name).length > 0;
    }
}
export class Units {
  SEQ_ID!:	number	;
  UNIT_NAME !: string	;
  UNIT_DESCRIPTION!: string	;
  ACTIVE !: boolean;
  CREATED_DATE!: string	;
  CREATED_BY!:	number	;
  MODIFIED_DATE!: string	;
  MODIFIED_BY!:number	;
  Type?: string;
  }
