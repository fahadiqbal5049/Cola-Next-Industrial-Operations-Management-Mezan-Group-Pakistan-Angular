import { Injectable } from '@angular/core';
import { environment } from '../../enironments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MaterialsService {
  readonly rootUrl = environment.baseUrl;
  constructor(private http: HttpClient) { }

  getMaterials() {
    return this.http.get<Materials[]>(this.rootUrl + '/api/Material/GetAllMaterial');
  }
  addMaterials(obj: any) {
    obj['Type'] = 'Save'
    return this.http.post<Materials[]>(this.rootUrl + '/api/Material/CreateMaterial', obj);
  }
  updateMaterials(obj: any): Observable<Materials[]> {
    const formattedData = {
      SEQ_ID: Number(obj.SEQ_ID),
      AUG_UNIT_SEQ_ID: Number(obj.AUG_UNIT_SEQ_ID),
      ITEM_NAME: obj.ITEM_NAME,
      ITEM_DESCRIPTION: obj.ITEM_DESCRIPTION,
      ACTIVE: obj.ACTIVE ? 1 : 0,
      MODIFIED_BY: Number(obj.MODIFIED_BY),
      Type: 'Update',
    };

    console.log('Formatted Data:', formattedData);

    return this.http.patch<Materials[]>(
      `${this.rootUrl}/api/Material/UpdateMaterial`,
      formattedData
    );
  }
  deleteMaterials(id: number) {
    return this.http.delete<any[]>(`${this.rootUrl}/api/Material/DeleteMaterial?id=${id}`, {responseType: 'text' as 'json'});
  }

}

export class Materials {
  SEQ_ID!: number;
  AUG_UNIT_SEQ_ID!: number;
  ITEM_NAME!: string;
  ITEM_DESCRIPTION!: string;
  ACTIVE!: boolean;
  CREATED_DATE!: Date;
  CREATED_BY!: number;
  MODIFIED_DATE!: Date;
  MODIFIED_BY!: number;
  UNIT_NAME!: string;
  UNIT_DESCRIPTION!: string;
  PACK_CAPACITY!: number;
}

