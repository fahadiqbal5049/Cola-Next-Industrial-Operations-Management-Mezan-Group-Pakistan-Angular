import { Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { environment } from '../../enironments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PageAutorizationService {
  readonly rootUrl = environment.baseUrl;

  constructor(private http: HttpClient, private authService: AuthService) { }

  getModules(){
    return this.http.get<any[]>(this.rootUrl + '/api/ModuleConfiguration/GetModule');
  }
  addModules(obj:any){
    obj["Type"]="Save";
    return this.http.post<any[]>(this.rootUrl + '/api/ModuleConfiguration/AddUpdateModule',obj);
  }
  updateModules(obj:any){
    obj["Type"]="Update";
    return this.http.post<any[]>(this.rootUrl + '/api/ModuleConfiguration/AddUpdateModule',obj);
  }
  deleteModules(id:number){
    const body = new HttpParams().set('seqId',id)
    return this.http.get<any[]>(this.rootUrl + '/api/ModuleConfiguration/DeleteModule',{params:body});
  }


  getSecurityComponents(){
    return this.http.get<any[]>(this.rootUrl + '/api/ModuleConfiguration/GetComponent');
  }
  addSecurityComponents(obj:any){
    obj["Type"]="Save";
    console.log(obj)
    return this.http.post<any[]>(this.rootUrl + '/api/ModuleConfiguration/AddUpdateComponent',obj);
  }
  updateSecurityComponents(obj:any){
    obj["Type"]="Update";
    delete obj["MODULE_NAME"]
    return this.http.post<any[]>(this.rootUrl + '/api/ModuleConfiguration/AddUpdateComponent',obj);
  }
  deleteSecurityComponents(id:number){
    const body = new HttpParams().set('seqId',id)
    return this.http.get<any[]>(this.rootUrl + '/api/ModuleConfiguration/DeleteComponent',{params:body});
  }


  getBlockedComponent(){
    return this.http.get<any[]>(this.rootUrl + '/api/ModuleConfiguration/GetBlockedComponent');
  }
  addBlockedComponent(obj:any){
    obj["Type"]="Save";
    return this.http.post(this.rootUrl + '/api/ModuleConfiguration/AddUpdateBlockedComponent', obj);
  }
  updateBlockedComponent(dep:any){
    dep["Type"] = 'Update';
    return this.http.post(this.rootUrl + '/api/ModuleConfiguration/AddUpdateBlockedComponent', dep);
  }
  deleteBlockedComponent(id:any){
    const body = new HttpParams().set('seqId',id ).set('Userid',this.authService.getUserId());
    return this.http.get<any[]>(this.rootUrl + '/api/ModuleConfiguration/DeleteBlockedComponent',{params:body});
  }




  // getAuthorization(){
  //   return this.http.get<any[]>(this.rootUrl + '/api/ModuleConfiguration/GetSecurities');
  // }





  // getSecurityGroups(){
  //   return this.http.get<any[]>(this.rootUrl + '/api/ModuleConfiguration/GetSecurityGroup');
  // }

  // getComponent(){
  //   return this.http.get<Components[]>(this.rootUrl + '/api/ModuleConfiguration/GetComponents');
  // }



  getModulesForFilter(){
    return this.http.get<Modules[]>(this.rootUrl + '/api/ModuleConfiguration/GetModule');
  }

  getComponentsFromModule(id: number, component: Components[]){
    return component.filter( e => e.MODULE_SEQ_ID == id)
  }
  
}

export class Modules 
{
  SeqId!: number;
  ModuleName!: string;
}


export class Components 
{
  SEQ_ID!: number;
  COMPONENT_NAME!: string;
  MODULE_SEQ_ID!: number;
}

