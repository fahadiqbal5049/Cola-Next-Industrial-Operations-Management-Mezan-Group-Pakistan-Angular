import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../enironments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  readonly rootUrl = environment.baseUrl;
  constructor(private http: HttpClient) { }

   getCategory() {
      return this.http.get<Category[]>(this.rootUrl + '/api/Category/GetCategory');
    }
    addCategory(obj: any) {
      obj['Type'] = 'Save'
      return this.http.post<Category[]>(this.rootUrl + '/api/Category/AddUpdateCategory', obj);
    }
    updateCategory(obj: any) {
      obj['Type'] = 'Update';
      obj['CREATED_BY'] = '';
      obj['MODIFIED_BY'] = '';
      obj['MODIFIED_DATE'] = '';
      delete obj['ACTIVE'] ;
      delete obj['CREATED_DATE'];
      //console.log(obj)
      return this.http.post<Category[]>(this.rootUrl + '/api/Category/AddUpdateCategory', obj);
    }
    deleteCategory(id: number) {
      return this.http.get<any[]>(this.rootUrl + '/api/Category/DeleteCategory?seqId='+id+'');
    }
    checkDuplicateCategory(name: string, names: Category[]){
      return names.filter( t => t.CATEGORY_NAME == name).length;
    }
}

export class Category {
  SEQ_ID!: number;
  CATEGORY_NAME!: string;
  DESCRIPTION!: string;
}