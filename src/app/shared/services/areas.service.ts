import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../enironments/environment';

@Injectable({
  providedIn: 'root'
})
export class AreasService {

  readonly rootUrl = environment.baseUrl;
  constructor(private http: HttpClient) { }

  getLocation() {
    return this.http.get<any[]>(this.rootUrl + '/api/Location/GetLocation');
  }
  getSubLocation() {
    return this.http.get<any[]>(this.rootUrl + '/api/Location/GetSubLocation');
  }
  getLocators() {
    return this.http.get<any[]>(this.rootUrl + '/api/Location/GetLocators');
  }

}
