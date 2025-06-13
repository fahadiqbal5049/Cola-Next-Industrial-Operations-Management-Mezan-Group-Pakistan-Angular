import { Injectable } from '@angular/core';
import { environment } from '../../enironments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SkuRecipeService {
  readonly rootUrl = environment.baseUrl;
  constructor(private http: HttpClient, private authService: AuthService ) { }

  private getHeaders() {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getSkuRecipe(): Observable<SKURecipe[]> {
    return this.http.get<SKURecipe[]>(`${this.rootUrl}/api/SkuRecipe/GetSkuRecipe`, { headers: this.getHeaders() });
  }

  addSkuRecipe(obj : any): Observable<SKURecipe[]> {
    obj['CREATED_BY'] = this.authService.getUserId();
    //  obj['Type'] = 'Save';
    console.log("Request Payload:", obj);
    return this.http.post<SKURecipe[]>(`${this.rootUrl}/api/SkuRecipe/CreateSkuRecipe`, obj, { headers: this.getHeaders() });
  }

  updateSkuRecipe(obj: any): Observable<SKURecipe[]> {
    // Ensure the data is correctly formatted
    const formattedData = {
      SEQ_ID: Number(obj.SEQ_ID),
      AUG_SKU_SEQ_ID: Number(obj.AUG_SKU_SEQ_ID),
      RECIPE_NAME: obj.RECIPE_NAME,
      RECIPE_DESCRIPTION: obj.RECIPE_DESCRIPTION,
      ACTIVE: Boolean(obj.ACTIVE),
      CREATED_BY: Number(obj.CREATED_BY),
      Type: 'Update', // Add the 'Type' field as required by your API
    };

    console.log('Formatted Data:', formattedData); // Log the formatted data

    return this.http.patch<SKURecipe[]>(
      `${this.rootUrl}/api/SkuRecipe/UpdateSkuRecipe`,
      formattedData,
      { headers: this.getHeaders() }
    );
  }

  deleteSkuRecipe(id: number): Observable<any> {
    console.log("DELETE Request ID:", id);
    return this.http.delete<any>(`${this.rootUrl}/api/SkuRecipe/DeleteSkuRecipe?id=${id}`, {
      headers: this.getHeaders(),
      observe: 'response',
      responseType: 'text' as 'json'
    });
  }

}

export class SKURecipe {
  SEQ_ID!: number;
  AUG_RECIPE_SEQ_ID!: number;
  RECIPE_NAME!: string;
  RECIPE_DESCRIPTION!: string;
  ACTIVE!: boolean;
  CREATED_DATE!: Date;
  CREATED_BY!: number;
  MODIFIED_DATE!: Date;
  MODIFIED_BY!: number;
  SKU_NAME!: string;
  SKU_DESCRIPTION!: string;
  PACK_CAPACITY!: number;
}
