import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../enironments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductionService {

  readonly rootUrl = environment.baseUrl;
  constructor(private http: HttpClient) { }

  getErpPlan() {
    return this.http.get<any[]>(this.rootUrl + '/api/ERPPlan/GetERPProductionSchedule');
  }
  getErpMovementPlan() {
    return this.http.get<any[]>(this.rootUrl + '/api/MoveOrder/GetMoveOrder');
  }
  getReadyForMovement() {
    return this.http.get<any[]>(this.rootUrl + '/api/MoveOrder/GetReadyForMovmentData');
  }
  getScannedMovement() {
    return this.http.get<any[]>(this.rootUrl + '/api/MoveOrder/GetScannedMoveOrderData');
  }
  getCompletedMovement() {
    return this.http.get<any[]>(this.rootUrl + '/api/MoveOrder/GetCompleteMoveOrderData');
  }
  getInTransistMovement() {
    return this.http.get<any[]>(this.rootUrl + '/api/MoveOrder/GetTransitMoveOrderData');
  }
  getPlannedProduction() {
    return this.http.get<any[]>(this.rootUrl + '/api/Production/GetProduction');
  }
  getProducedBundles() {
    return this.http.get<any[]>(this.rootUrl + '/api/Production/GetBundleProduced');
  }
  getAugitCode() {
    return this.http.get<any[]>(this.rootUrl + '/api/Production/GenerateQRCodeForAugit');
  }
  getPrintableMachines() {
    return this.http.get<any[]>(this.rootUrl + '/api/Production/GenerateMultipleQRCodes');
  }
  getFgInventory() {
    return this.http.get<any[]>(this.rootUrl + '/api/Production/GetFGInventory');
  }
  getScannedBundles() {
    return this.http.get<any[]>(this.rootUrl + '/api/Production/GetQRCodeForScanned');
  }
  getInventory() {
    return this.http.get<any[]>(this.rootUrl + '/api/InternalMovment/GetShiftedInventory');
  }
  getExternalMovements() {
    return this.http.get<any[]>(this.rootUrl + '/api/Production/GetSalesMovment');
  }
  getDeliveredBundles() {
    return this.http.get<any[]>(this.rootUrl + '/api/SalesMovment/GetDispatchedInventory');
  }
  addPlannedProduction(obj: any) {
    obj['Type'] = 'Save';
    console.log(obj)
    return this.http.post<any[]>(this.rootUrl + '/api/Production/AddUpdateProduction', obj);
  }
  updateInternalMovment(bundels: any, locations: any) {

    return this.http.post<any[]>(this.rootUrl + '/api/InternalMovment/UpdateInternalMovment', {
      locationLocatorsObj: locations,
      internalMovementObj: bundels
    });
  }
  updateERPMovmentPlan(obj: any) {
    console.log(obj)
    return this.http.post<any[]>(this.rootUrl + '/api/MoveOrder/GetFGInventoryByItemCodeAndQuantity', obj);
  }
  updateSalesMovment(bundels: any, customer: any) {
    console.log('customer', customer)
    console.log('bundels', bundels)
    return this.http.post<any[]>(this.rootUrl + '/api/SalesMovment/UpdateSalesMovment', {
      customerObj: customer,
      salesMovementObj: bundels
    });
  }

}
