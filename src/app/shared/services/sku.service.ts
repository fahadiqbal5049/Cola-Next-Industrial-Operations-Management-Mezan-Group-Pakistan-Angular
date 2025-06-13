// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { environment } from '../../enironments/environment';
// import { AuthService } from './auth.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class SkuService {
//   readonly rootUrl = environment.baseUrl;
//   constructor(private http: HttpClient) { }

//     getSku() {
//       return this.http.get<SKU[]>(this.rootUrl + '/api/Sku/GetSku');
//     }
//     addSku(obj: any) {
//       obj['Type'] = 'Save'
//       return this.http.post<SKU[]>(this.rootUrl + '/api/Sku/UpdateSku', obj);
//     }
//     updateSku(obj: any) {
//       obj['Type'] = 'Update';
//       obj['CREATED_BY'] = '';
//       obj['MODIFIED_BY'] = '';
//       obj['MODIFIED_DATE'] = '';
//       delete obj['ACTIVE'] ;
//       delete obj['CREATED_DATE'];
//       //console.log(obj)
//       return this.http.post<SKU[]>(this.rootUrl + '/api/Sku/UpdateSku', obj);
//     }
//     deleteSku(id: number) {
//       return this.http.get<any[]>(this.rootUrl + '/api/Sku/DeleteSKU?seqId='+id+'');
//     }
//     checkDuplicateSku(name: string, names: SKU[]){
//       return names.filter( t => t.SKU_NAME == name).length;
//     }
// }
// export class SKU {
//   SEQ_ID!: number;
//   SKU_NAME!: string;
//   DESCRIPTION!: string;
// }


import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../enironments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SkuService {
  readonly rootUrl = environment.baseUrl;
  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders() {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getSku() {
    return this.http.get<SKU[]>(this.rootUrl + '/api/Sku/GetSku', { headers: this.getHeaders() });
  }

  addSku(obj: any) {
    obj['CREATED_BY'] = this.authService.getUserId();
    obj['ACTIVE'] = true;
    obj['Type'] = 'Save';
    return this.http.post<SKU[]>(this.rootUrl + '/api/Sku/CreateSku', obj, { headers: this.getHeaders() });
  }

  updateSku(obj: any) {
    obj['MODIFIED_BY'] = this.authService.getUserId();
    obj['Type'] = 'Update';
    return this.http.patch<SKU[]>(this.rootUrl + '/api/Sku/UpdateSku', obj, { headers: this.getHeaders() });
  }

  deleteSku(id: number) {
    return this.http.delete<any>(`${this.rootUrl}/api/Sku/DeleteSku?id=${id}`, { headers: this.getHeaders(), responseType: 'text' as 'json' });
  }
  checkDuplicateSku(name: string, names: SKU[]) {
    return names.filter(t => t.SKU_NAME === name).length > 0;
  }
}

export class SKU {
  SEQ_ID!: number;
  SKU_NAME!: string;
  SKU_DESCRIPTION!: string;
  ACTIVE!: boolean;
  CREATED_BY!: number;
  MODIFIED_BY!: number;
}
