import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../enironments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShiftdetailsService {
  readonly rootUrl = environment.baseUrl;
  constructor(private http: HttpClient) { }

  getShiftsDetails() {
    return this.http.get<SHIFTSDetails[]>(this.rootUrl + '/api/ShiftDetails/GetAllProductPlan');
  }
  addShiftsDetails(obj: any) {
    obj['Type'] = 'Save'
    return this.http.post<SHIFTSDetails[]>(this.rootUrl + '/api/ShiftDetails/CreateShiftDetails', obj);
  }
  updateShiftsDetails(obj: any): Observable<SHIFTSDetails> {
    const formattedData = {
      SEQ_ID: Number(obj.SEQ_ID),
      SHIFT_NAME: obj.SHIFT_NAME,
      START_TIME: obj.START_TIME,
      END_TIME: obj.END_TIME,
      ACTIVE: obj.ACTIVE ? 1 : 0,
      Type: 'Update',
    };

    console.log('Formatted Data:', formattedData); // Log the formatted data

    return this.http.patch<SHIFTSDetails>(
      `${this.rootUrl}/api/ShiftDetails/UpdateProductPlan`,
      formattedData
    );
  }
  // deleteShiftsDetails(id: number) {
  //   return this.http.get<any[]>(this.rootUrl + '/api/ShiftDetails/DeleteProductPlan?seqId='+id+'');
  // }
  deleteShiftsDetails(id: number) {
    return this.http.delete<any[]>(`${this.rootUrl}/api/ShiftDetails/DeleteProductPlan?id=${id}`, {responseType: 'text' as 'json'});
  }

}

export class SHIFTSDetails {
  SEQ_ID!: number;
  SHIFT_NAME!: string;
  START_TIME!: string;
  END_TIME!: string;
  ACTIVE!: boolean;
  CREATED_DATE!: string;
  CREATED_BY!: number;
  MODIFIED_DATE!: string | null;
  MODIFIED_BY!: number | null;
}
