import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../enironments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  readonly rootUrl = environment.baseUrl;
  constructor(private http: HttpClient) { }
}
