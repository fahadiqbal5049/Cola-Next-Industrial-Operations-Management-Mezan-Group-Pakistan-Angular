import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../enironments/environment';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SkuDetailService {
  readonly rootUrl = environment.baseUrl;
  constructor(private http: HttpClient) { }

  getSkuDetails() {
    return this.http.get<SKUDetails[]>(this.rootUrl + '/api/SkuRecipeDetails/GetAllSkuRecipeDetails');
  }
  addSkuDetails(obj: any) {
    obj['Type'] = 'Save'
    return this.http.post<SKUDetails[]>(this.rootUrl + '/api/SkuRecipeDetails/CreateSkuRecipeDetails', obj);
  }
  updateSkuDetails(obj: any): Observable<SKUDetails[]> {

    const formattedData = {
      SEQ_ID: Number(obj.SEQ_ID),
      AUG_RECIPE_SEQ_ID: Number(obj.AUG_RECIPE_SEQ_ID),
      AUG_MATERIAL_SEQ_ID: Number(obj.AUG_MATERIAL_SEQ_ID),
      QUANTITY: Number(obj.QUANTITY),
      ACTIVE: obj.ACTIVE ? 1 : 0,
      CREATED_BY: Number(obj.CREATED_BY),
      Type: 'Update',
    };

    console.log('Formatted Data:', formattedData);

    return this.http.patch<SKUDetails[]>(
      `${this.rootUrl}/api/SkuRecipeDetails/UpdateSkuRecipeDetails`,
      formattedData
    );
  }
  deleteSkuDetails(id: number) {
    return this.http.delete<any[]>(`${this.rootUrl}/api/SkuRecipeDetails/DeleteSkuRecipeDetails?id=${id}`, {responseType: 'text' as 'json'});
  }

}

export class SKUDetails {
  SEQ_ID!: number;
  AUG_RECIPE_SEQ_ID!: number;
  AUG_MATERIAL_SEQ_ID!: number;
  QUANTITY!: number;
  ACTIVE!: boolean;
  CREATED_DATE!: string;
  CREATED_BY!: number;
  MODIFIED_DATE!: string | null;
  MODIFIED_BY!: number | null;
  ITEM_DESCRIPTION!: string;
  ITEM_NAME!: number;
  UNIT_NAME!: string;
  UNIT_DESCRIPTION!: string;
}

