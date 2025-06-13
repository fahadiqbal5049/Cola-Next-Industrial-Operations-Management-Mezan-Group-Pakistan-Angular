import { Injectable } from '@angular/core';
import { environment } from '../../enironments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MachineService {
  readonly rootUrl = environment.baseUrl;
  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders() {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getMachines() {
    return this.http.get<MACHINES[]>(this.rootUrl + '/api/Machine/GetAllMachine', { headers: this.getHeaders() });
  }

  addMachines(obj: any) {
    obj['CREATED_BY'] = this.authService.getUserId();
    obj['ACTIVE'] = true;
    obj['Type'] = 'Save';
    return this.http.post<MACHINES[]>(this.rootUrl + '/api/Machine/CreateMachine', obj, { headers: this.getHeaders() });
  }

  updateMachines(obj: any) {
    obj['MODIFIED_BY'] = this.authService.getUserId();
    obj['Type'] = 'Update';
    return this.http.patch<MACHINES[]>(this.rootUrl + '/api/Machine/UpdateMachine', obj, { headers: this.getHeaders() });
  }

  // deleteMachines(id: number) {
  //   return this.http.delete<any[]>(this.rootUrl + '/api/Machine/DeleteMachine?id=${id}' , { headers: this.getHeaders() });
  // }
  deleteMachines(id: number) {
    return this.http.delete<any>(`${this.rootUrl}/api/Machine/DeleteMachine?id=${id}`, { headers: this.getHeaders(), responseType: 'text' as 'json' });
  }

  checkDuplicateMachines(name: string, names: MACHINES[]) {
    return names.filter(t => t.MACHINE_NAME === name).length > 0;
  }
}

export class MACHINES {
  SEQ_ID!: number;
  MACHINE_NAME!: string;
  MACHINE_DESCRIPTION!: string;
  ACTIVE!: boolean;
  CREATED_BY!: number;
  MODIFIED_BY!: number;
}
