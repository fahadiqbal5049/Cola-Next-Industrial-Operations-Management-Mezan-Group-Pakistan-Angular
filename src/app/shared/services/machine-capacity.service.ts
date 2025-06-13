import { Injectable } from '@angular/core';
import { environment } from '../../enironments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MachineCapacityService {
  readonly rootUrl = environment.baseUrl;
  constructor(private http: HttpClient, private authService: AuthService) { }

   private getHeaders() {
      const token = this.authService.getToken();
      return new HttpHeaders({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      });
    }

  getMachineCapacity() {
    return this.http.get<MACHINECAPACITYDetails[]>(this.rootUrl + '/api/MachineCapacity/GetAllMachineCapacity', {
      headers: this.getHeaders(),
    });
  }
  addMachineCapacity(obj: any) {
    obj['Type'] = 'Save'
    return this.http.post<MACHINECAPACITYDetails[]>(this.rootUrl + '/api/MachineCapacity/CreateMachineCapacity', obj, {
      headers: this.getHeaders(),
    });
  }
  updateMachineCapacity(obj: any) {
    obj['Type'] = 'Update';
    // delete obj['MACHINE_NAME'];
    // delete obj['MACHINE_DESCRIPTION'];
    // delete obj['SKU_NAME'];
    // delete obj['SKU_DESCRIPTION'];
    // delete obj['CREATED_BY'];
    // delete obj['MODIFIED_BY'];
    // delete obj['MODIFIED_DATE'];
    // delete obj['ACTIVE'];
    // delete obj['CREATED_DATE'];
    console.log(obj)
    return this.http.patch<MACHINECAPACITYDetails[]>(this.rootUrl + '/api/MachineCapacity/UpdateMachineCapacity', obj, {
      headers: this.getHeaders(),
    });
  }
  deleteMachineCapacity(id: number) {
    return this.http.delete(`${this.rootUrl}/api/MachineCapacity/DeleteMachineCapacity?id=${id}`, {
      headers: this.getHeaders(),
      responseType: 'text'
    });
  }

}

export class MACHINECAPACITYDetails {
  SEQ_ID!: number;
  AUG_MACHINE_SEQ_ID!: number;
  AUG_SKU_SEQ_ID!: number;
  HOURLY_CAPACITY_IN_BOTTLES!: number;
  SHIFT_CAPACITY_IN_BOTTLES!: number;
  ACTIVE!: number;
  CREATED_DATE!: string;
  CREATED_BY!: number;
  MODIFIED_DATE!: string;
  MODIFIED_BY!: number;
  MACHINE_NAME!: string | null;
  MACHINE_DESCRIPTION!: string | null;
  SKU_NAME!: string;
  SKU_DESCRIPTION!: string;
  PACK_CAPACITY!: number;
}

