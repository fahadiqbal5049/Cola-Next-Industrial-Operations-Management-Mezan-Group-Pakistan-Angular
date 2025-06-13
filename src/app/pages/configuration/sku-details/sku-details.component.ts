import { Component } from '@angular/core';
import notify from 'devextreme/ui/notify';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import { exportDataGrid } from 'devextreme/excel_exporter';
import {
  DxDataGridModule,
  DxDataGridTypes,
} from 'devextreme-angular/ui/data-grid';
import {
  SkuDetailService,
  SKUDetails,
} from '../../../shared/services/sku-detail.service';
import { SkuService } from '../../../shared/services/sku.service';
import {
  DxPopupModule,
  DxFormModule,
  DxButtonModule,
} from 'devextreme-angular';
import { AuthService } from '../../../shared/services/auth.service';
@Component({
  selector: 'app-sku-details',
  templateUrl: './sku-details.component.html',
  styleUrl: './sku-details.component.scss',
  standalone: true,
  imports: [DxDataGridModule, DxPopupModule, DxFormModule, DxButtonModule],
})
export class SkuDetailsComponent {
  // formData: any = {};
  formData: SKUDetails = new SKUDetails();
  dataSource!: SKUDetails[];
  sku: any[] = [];
  customer: any[] = [];
  loading: boolean = false;
  authsource: any;

  addPopUp: boolean = false;
  editPopUp: boolean = false;

  constructor(
    private configuration: SkuDetailService,
    private skuService: SkuService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getData();
    this.getDataSku();
  }

  getData() {
    this.configuration.getSkuDetails().subscribe((data) => {
      this.dataSource = data;
      console.log(data);
    });
  }
  getgroupname(){
   this.authsource= this.authService.getGroupName;
  }

  getDataSku() {
    this.skuService.getSku().subscribe((data) => {
      this.sku = data;
      console.log(this.sku);
    });
  }

  onSubmit(e: any) {
    e.preventDefault();

    // Function For Checking Duplicate Name
    // if(this.configuration.checkDuplicateCategory(this.formData['PlantName'], this.dataSource))
    // {
    //   notify("Plant Name already exists!", "warning")
    //   return;
    // }
    // End Code Here
    this.configuration.addSkuDetails(this.formData).subscribe((data) => {
      this.formData = new SKUDetails();
      this.getData();
      notify('SKU Detail added successfully', 'success');
      this.addPopUp = false;
    });
  }

  onUpdate(e: any) {
    e.preventDefault();

    const updatedData = {
      SEQ_ID: Number(this.formData.SEQ_ID),
      AUG_RECIPE_SEQ_ID: Number(this.formData.AUG_RECIPE_SEQ_ID),
      AUG_MATERIAL_SEQ_ID: Number(this.formData.AUG_MATERIAL_SEQ_ID),
      QUANTITY: Number(this.formData.QUANTITY),
      ACTIVE: this.formData.ACTIVE ? 1 : 0,
      CREATED_BY: Number(this.formData.CREATED_BY),
    };

    console.log('Updated Data:', updatedData);

    this.configuration.updateSkuDetails(updatedData).subscribe(
      (data) => {
        this.formData = new SKUDetails();
        this.getData();
        notify('SKU Detail updated successfully', 'success');
        this.editPopUp = false;
      },
      (error) => {
        console.error('Error updating SKU Detail:', error);
        if (error.error) {
          console.error('API Error Response:', error.error);
        }
        notify('Error updating SKU Detail', 'error');
      }
    );
  }

  onEdit(e: any) {
    this.formData = Object.assign({}, e);
    this.editPopUp = true;
  }

  onDelete(e: any) {
    if (!confirm('Are you sure you want to delete entry?')) return;

    this.configuration.deleteSkuDetails(e.SEQ_ID).subscribe((data) => {
      this.getData();
      notify('SKU Detail delete successfully', 'success');
    });
  }

  openAddForm() {
    this.formData = new SKUDetails();
    this.addPopUp = true;
  }

  onExporting(e: DxDataGridTypes.ExportingEvent) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Employees');

    exportDataGrid({
      component: e.component,
      worksheet,
      autoFilterEnabled: true,
    }).then(() => {
      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(
          new Blob([buffer], { type: 'application/octet-stream' }),
          'DataGrid.xlsx'
        );
      });
    });
  }
}
