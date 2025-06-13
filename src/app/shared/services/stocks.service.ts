import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../enironments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StocksService {
  readonly rootUrl = environment.baseUrl;
  constructor(private http: HttpClient) { }

  getStocksDetails() {
    return this.http.get<STOCKSDetails[]>(this.rootUrl + '/api/Stock/GetAllProductPlan');
  }
  addStocksDetails(obj: any) {
    obj['Type'] = 'Save'
    return this.http.post<STOCKSDetails[]>(this.rootUrl + '/api/Stock/CreateStock', obj);
  }
  updateStocksDetails(obj: any): Observable<STOCKSDetails[]> {
    const formattedData = {
      SEQ_ID: Number(obj.SEQ_ID),
      SKU_SEQ_ID: Number(obj.SKU_SEQ_ID),
      STOCK_IN_PACKS: Number(obj.STOCK_IN_PACKS),
      STOCK_IN_BOTTELS: Number(obj.STOCK_IN_BOTTELS),
      MONTH: Number(obj.MONTH),
      ACTIVE: obj.ACTIVE ? 1 : 0,
      CREATED_BY: Number(obj.CREATED_BY),
      Type: 'Update',
    };

    console.log('Formatted Data:', formattedData);

    return this.http.patch<STOCKSDetails[]>(
      `${this.rootUrl}/api/Stock/UpdateStock`,
      formattedData
    );
  }
  // deleteStocksDetails(id: number) {
  //   return this.http.get<any[]>(this.rootUrl + '/api/Stock/DeleteStock?seqId='+id+'');
  // }
  deleteStocksDetails(id: number) {
    return this.http.delete<any[]>(`${this.rootUrl}/api/Stock/DeleteStock?id=${id}`, {responseType: 'text' as 'json'});
  }

}

export class STOCKSDetails {
  SEQ_ID!: number;
  SKU_SEQ_ID!: number;
  PACK_CAPACITY!: number;
  SKU_NAME!: string;
  STOCK_IN_BOTTELS!: number;
  STOCK_IN_PACKS!: number;
  ACTIVE!: boolean;
  CREATED_DATE!: string;
  MODIFIED_DATE!: string;
  MODIFIED_BY!: number;
  CREATED_BY!: number;
  MONTH!: number;
}

