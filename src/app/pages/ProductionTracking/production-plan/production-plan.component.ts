import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { DxDataGridModule, DxPopupModule, DxFormModule, DxButtonModule } from 'devextreme-angular';
import { DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import { exportDataGrid } from 'devextreme/excel_exporter';
import notify from 'devextreme/ui/notify';
import { Workbook } from 'exceljs';
import saveAs from 'file-saver';
import { AreasService } from '../../../shared/services/areas.service';
import { ProductionService } from '../../../shared/services/production.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-production-plan',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgSelectModule, DxDataGridModule, DxPopupModule, DxFormModule, DxButtonModule],
  templateUrl: './production-plan.component.html',
  styleUrl: './production-plan.component.scss'
})
export class ProductionPlanComponent {
  loading: any
  dataSource: any
  readyForMovementData: any
  scannedBundles: any
  producedBundles: any = []
  inTransitData: any
  Locations: any
  currentTab = 'ERP';
  // bindingForm = new FormGroup({
  //   SEQ_ID: new FormControl(null, Validators.required),
  //   JOB_NUMBER: new FormControl(null, Validators.required),
  //   LOCATION_NAME: new FormControl(),
  //   TO_LOCATION_SEQ_ID: new FormControl(null, Validators.required),
  //   STATUS: new FormControl('Ready For Movement'),
  // })
  constructor(private productionService: ProductionService, private areasService: AreasService, private router: Router) { }

  ngOnInit(): void {
    this.getData();
    // this.getReadyForMovement();
    // this.getCompletedMovements();
    // this.getIntransist();
    this.getLocations();
    this.getSubLocations();
    this.getLocatorIds();
    this.getErpPlan();

    window.onafterprint = () => {
      console.log("Printing completed!");

    };

  }

  onExporting(e: DxDataGridTypes.ExportingEvent) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Erp Plan');

    exportDataGrid({
      component: e.component,
      worksheet,
      autoFilterEnabled: true,
    }).then(() => {
      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'ErpPlan.xlsx');
      });
    });

  }

  getData() {
    this.productionService.getPlannedProduction().subscribe(
      data => {
        console.log(data)
        this.dataSource = data

      }
    )
  }


  getReadyForMovement() {
    this.productionService.getReadyForMovement().subscribe(
      data => {
        console.log(data)
        this.readyForMovementData = data

      }
    )
  }

  getScannedBundles() {
    this.productionService.getScannedBundles().subscribe(
      data => {
        console.log(data)
        this.scannedBundles = data

      }
    )
  }

  getProducedBundles() {
    this.productionService.getProducedBundles().subscribe(
      data => {
        console.log(data)
        data.forEach((element: any) => {
          element.QR_CODE = this.getImageElement(element.QR_CODE)
        });
        this.producedBundles = data

      }
    )
  }
  getIntransist() {
    this.productionService.getInTransistMovement().subscribe(
      data => {
        console.log(data)
        this.inTransitData = data

      }
    )
  }
  getLocations() {
    this.areasService.getLocation().subscribe(
      data => {
        console.log(data)
        this.Locations = data

      }
    )
  }
  onJobNumberClick(e: any) {
    // console.log(e)
    if (e.column.caption == 'Job Number') {
      this.onSelectErpPlan(e.data)
      this.currentTab = 'Generate'
    }

    // if (e.column.caption == 'Job Number') {
    //   console.log(e.data.JOB_NUMBER)
    //   this.locationForm.patchValue({
    //     SEQ_ID: e.data.SEQ_ID,
    //     ITEM_CODE: e.data.JOB_NUMBER,
    //     LOCATION_NAME: e.data.LOCATION_NAME,
    //     TO_LOCATION_SEQ_ID: null,
    //   })
    //   // this.router.navigate(['generate-plan'], { queryParams: { jobNumber: e.data.JOB_NUMBER } })
    //   this.currentTab = 'l'
    // }
  }
  printableJobNumber = 0
  printableData: any = []
  onPrintableJob(e: any) {
    if (e.column.caption == 'Job Number') {
      console.log(this.producedBundles, e.data.JOB_NUMBER)
      this.printableData = this.producedBundles.filter((f: any) => f.JOB_NUMBER == e.data.JOB_NUMBER)
      console.log(this.printableData)
      this.printCard()
    }
  }

  onTabChange(e: string) {
    switch (e) {
      case 'ERP':
        this.currentTab = 'ERP'
        break;
      case 'Generate':
        this.currentTab = 'Generate'
        break;
      case 'Planned':
        this.getProducedBundles();
        this.currentTab = 'Planned'
        break;
      case 'Produced':
        this.getProducedBundles();
        this.currentTab = 'Produced'
        break;
      case 'Print':
        this.getProducedBundles();
        this.currentTab = 'Print'
        break;
      case 'Scanned':
        this.currentTab = 'Scanned'
        this.getScannedBundles();
        break;
      case 'Assign':
        if (this.selectedRows.length > 0) {
          this.currentTab = 'Assign'

        } else {
          notify('Please First Select Data From Scanned Bundles', 'warning')
        }
        break;


      default:
        this.currentTab = 'Planned'
        break;
    }
  }
  onSubmit() {
    // delete this.bindingForm.value.LOCATION_NAME;
    // this.productionService.updateERPMovmentPlan(this.bindingForm.value).subscribe(data => {
    //   notify('Record Updated Successfully', 'success')
    //   this.bindingForm.reset();
    // })
  }

  convertBase64ToImage(base64String: string): HTMLImageElement {
    const img = new Image();
    img.src = `data:image/png;base64,${base64String}`;
    return img;
  }
  getImageElement(base64String: string): string {
    const img = this.convertBase64ToImage(base64String);
    return img.src;
  }



  printCard() {
    const printWindow = window.open('', '', 'width=800,height=600'); // Define print window size
    printWindow?.document.write(`<html><head><title>Print</title>
      <style>
        @media print {
          @page {
            size: auto;
            margin:0;
            padding: 0;

          }
          .card-dimension {
            display: grid;
            justify-content: center;
            align-items: center;
            grid-template-columns: 1.75in auto;
            //gap: 5px;
            page-break-after: always;
            page-break-inside: avoid;
            //width: 100%;
            height: 2.5in;
            padding:20px 0px;
            padding-left:0.2in;
            font-style:'';

          }
  
          .qr-code-area {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            
            //margin-right: 5px;
          }
  
          .qr-code-area img {
            height: 1.7in;
            width: 1.7in;
          }
  .qr-code-area p {
    margin: 0px;
    font-size: 25px;
    font-weight: bold;
}
          .qr-detail {
            display: block;
            flex-direction: column;
            justify-content: center;
            align-item: center;
            max-width:100%;
            overflow-wrap:wrap;
            height:max-content;
          }
  
          .detail-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom:5px;
            font-family: sans-serif;
          }
  
          .detail-value {
            font-family: sans-serif;
            font-size: 16px;
            font-weight: 600;
            white-space: normal;
            margin:0px;

          }
        }
      </style>
    </head><body>`);

    // Generate and insert the printable content
    const printContent = document.createElement('div');
    printContent.innerHTML = this.getPrintableContent();

    printWindow?.document.body.appendChild(printContent);
    printWindow?.document.write('</body></html>');
    printWindow?.document.close();
    printWindow?.print();
  }


  getPrintableContent(): string {
    let content = '';

    // content += `
    //     <div class="card-dimension">

    //       <div class="qr-code-area">
    //         <img src="${this.augitQr}" alt="QR Code" class="qr-code">
    //       </div>
    //               <div class="qr-detail" overflow: hidden; text-overflow: ellipsis;">
    //                 <p class="detail-title" style="font-size:16px;">AUGIT Technologies</p>
    //                 <br>
    //                 <p class="detail-value" style="font-size:15px;">8A, PCSIR-1, Canal Road, Lahore</p>
    //                 <br>
    //                 <p class="detail-value" style="font-size:12px;">info@augit.tech</p>
    //       </div>
    //     </div>
    //   `;

    this.printableData.forEach((item: any) => {
      content += `
        <div class="card-dimension">

          <div class="qr-code-area">
            <img src="${item.QR_CODE}" alt="QR Code" class="qr-code">
            <p>${item.QR_CODE_NUMBER}</p>
          </div>
                  <div class="qr-detail" overflow: hidden; text-overflow: ellipsis;">
                    <p class="detail-title" style="font-size:16px;">AUGIT Technologies</p>
                    <br>
                    <p class="detail-value" style="font-size:15px;">Canal Rd,Block A Phase 1 P.C.S.I.R 1 Lahore</p>
                    <br>
                    <p class="detail-value" style="font-size:12px;">info@gmail.com</p>
          </div>
        </div>
      `;
    });

    return content;
  }









  SubLocations: any[] = [];
  FilteredSubLocations: any[] = [];
  FilteredLocators: any[] = [];
  LocatorId: any[] = [];
  locatorCapacity = 0
  selectedBundeles = 0
  selectedRows: any = []

  locationForm = new FormGroup({
    SEQ_ID: new FormControl(),
    ITEM_CODE: new FormControl(),
    LOCATION_NAME: new FormControl(),
    SUB_LOCATION_NAME: new FormControl(),
    LOCATOR_NAME: new FormControl()
  })

  getSubLocations() {
    this.areasService.getSubLocation().subscribe(
      data => {
        console.log(data)
        this.SubLocations = data

      }
    )
  }

  getLocatorIds() {
    this.areasService.getLocators().subscribe(
      data => {
        console.log(data)
        this.LocatorId = data

      }
    )
  }

  onSelect(e: any) {
    this.selectedRows = []
    e.selectedRowKeys.forEach((element: any) => {
      var obj = {
        SEQ_ID: element.SEQ_ID
      }
      this.selectedRows.push(obj)
    });

    //this.selectedRows = e.selectedRowKeys
    console.log(this.selectedRows)
    this.selectedBundeles = this.selectedRows.length

  }
  onSelectLocation(e: any) {
    // console.log(e, this.SubLocations)
    this.FilteredSubLocations = this.SubLocations!.filter(f => f.LOCATION_SEQ_ID == e.SEQ_ID)
  }
  onSelectSubLocation(e: any) {
    console.log(e, this.LocatorId)
    this.FilteredLocators = this.LocatorId!.filter(f => f.SUB_LOCATION_SEQ_ID == e.SEQ_ID)
  }

  multipleLocatons: any[] = []
  onMultiLocators(e: any) {
    this.multipleLocatons = []
    this.locatorCapacity = 0
    e.forEach((element: any) => {
      var obj = {
        LOCATION_NAME: this.locationForm.value.LOCATION_NAME,
        SUB_LOCATION_NAME: this.locationForm.value.SUB_LOCATION_NAME,
        LOCATOR_NAME: element.LOCATOR_NAME,
      }
      this.locatorCapacity += element.MIN_LEVEL;
      this.multipleLocatons.push(obj)
    });
  }

  onAddLocation(e: any) {
    if (this.selectedBundeles <= this.locatorCapacity) {
      this.productionService.updateInternalMovment(this.selectedRows, this.multipleLocatons).subscribe(res => {
        // this.addPopUp = false;
        notify('Location Assigned Successfully', 'success')
      })
    } else {
      notify('Locator Capacity Insufficient', 'error')

    }
  }















  selctedJob: string = '';
  maxQuantity: number = 0;
  erpPlan: any[] = [

    {
      ITEM_CODE: 'TEST',
      JOB_NUMBER: 'TEST',
      ASSEMBLY_CODE: 'TEST',
      SUB_CODE: 'TEST',
      DESCRIPTION: 'TEST',
      CUSTOMER: 'TEST'
    }
  ]
  plannedProduction: any[] = []
  bindingForm = new FormGroup(
    {
      ITEM_CODE: new FormControl(null, Validators.required),
      JOB_NUMBER: new FormControl(null, Validators.required),
      ASSEMBLY_CODE: new FormControl(null, Validators.required),
      SUB_CODE: new FormControl(null, Validators.required),
      DESCRIPTION: new FormControl(null, Validators.required),
      CUSTOMER: new FormControl(null, Validators.required),
      QUANTITY: new FormControl(null, Validators.required),
      SIZE: new FormControl(null, Validators.required),
      TOTAL_BUNDLES: new FormControl(),

    }
  )

  // ngOnInit(): void {
  //   this.selctedJob = this.activatedRoute.snapshot.queryParamMap.get('jobNumber')!;
  // }
  ngAfterViewInit(): void {
  }

  getGenratedBundles() {
    this.productionService.getPlannedProduction().subscribe(data => {
      this.plannedProduction = data
      console.log(data)
      if (this.selctedJob != null) {
        var filteredPlannedPlan = this.plannedProduction.filter(f => f.JOB_NUMBER == this.selctedJob)
        var filteredErpPlan = this.erpPlan.filter(f => f.JOB_NUMBER == this.selctedJob)
        this.maxQuantity = 0
        console.log(filteredErpPlan, filteredPlannedPlan)
        filteredPlannedPlan.forEach(f => {
          this.maxQuantity += f.QUANTITY
        })
        console.log(filteredErpPlan[0].QUANTITY, this.maxQuantity)

        this.maxQuantity = (filteredErpPlan[0].QUANTITY - this.maxQuantity)
        console.log(this.maxQuantity)

      }


    })
  }

  getErpPlan() {
    this.productionService.getErpPlan().subscribe(data => {
      this.erpPlan = data
      var filteredErpPlan = this.erpPlan.filter(f => f.JOB_NUMBER == this.selctedJob)
      if (filteredErpPlan.length > 0) {
        this.bindingForm.patchValue({
          ITEM_CODE: filteredErpPlan[0].ITEM_CODE,
          JOB_NUMBER: filteredErpPlan[0].JOB_NUMBER,
          SUB_CODE: filteredErpPlan[0].SUB_CODE,
          DESCRIPTION: filteredErpPlan[0].JOB_DESCRIPTION,
          CUSTOMER: filteredErpPlan[0].CUSTOMER_CODE,
          ASSEMBLY_CODE: filteredErpPlan[0].ASSEMBLY_CODE,
          SIZE: filteredErpPlan[0].SIZE,
        })
      }

      this.getGenratedBundles();

    })
  }

  onSelectErpPlan(e: any) {
    console.log(e)
    var filteredErpPlan = this.erpPlan.filter(f => f.ITEM_CODE == e.ITEM_CODE || f.JOB_NUMBER == e.JOB_NUMBER || f.ASSEMBLY_CODE == e.ASSEMBLY_CODE ||
      f.SUB_CODE == e.SUB_CODE || f.JOB_DESCRIPTION == e.DESCRIPTION || f.CUSTOMER_CODE == e.CUSTOMER)
    this.selctedJob = filteredErpPlan[0].JOB_NUMBER
    console.log(filteredErpPlan, this.selctedJob)

    this.getGenratedBundles();

    if (filteredErpPlan.length > 0) {
      this.bindingForm.patchValue({
        ITEM_CODE: filteredErpPlan[0].ITEM_CODE,
        JOB_NUMBER: filteredErpPlan[0].JOB_NUMBER,
        SUB_CODE: filteredErpPlan[0].SUB_CODE,
        DESCRIPTION: filteredErpPlan[0].JOB_DESCRIPTION,
        CUSTOMER: filteredErpPlan[0].CUSTOMER_CODE,
        ASSEMBLY_CODE: filteredErpPlan[0].ASSEMBLY_CODE,
        SIZE: filteredErpPlan[0].SIZE,
      })
    }

  }
  onSubmitPlan() {
    // console.log(this.bindingForm.value)
    if (this.bindingForm.valid) {
      this.bindingForm.patchValue({
        TOTAL_BUNDLES: Math.ceil(this.bindingForm.value.QUANTITY! / this.bindingForm.value.SIZE!)
      })
      // console.log(this.bindingForm.value)
      this.productionService.addPlannedProduction(this.bindingForm.value).subscribe(data => {
        notify('Record Added Successfully', 'success')
        this.bindingForm.reset();
        this.maxQuantity = 0
        this.getErpPlan()
      })
    } else {
      notify('Missing Fields', 'warning')
    }
  }

  reset() {
    // this.router.navigate(['generate-plan'])
    this.bindingForm.reset();
    this.maxQuantity = 0;
  }
}
