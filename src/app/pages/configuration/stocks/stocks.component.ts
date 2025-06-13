import { Component } from '@angular/core';
import {
  DxButtonModule,
  DxDataGridModule,
  DxFormModule,
  DxPopupModule,
} from 'devextreme-angular';
import {
  STOCKSDetails,
  StocksService,
} from '../../../shared/services/stocks.service';
import notify from 'devextreme/ui/notify';
import { DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import { Workbook } from 'exceljs';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-stocks',
  standalone: true,
  imports: [DxDataGridModule, DxPopupModule, DxFormModule, DxButtonModule],
  templateUrl: './stocks.component.html',
  styleUrl: './stocks.component.scss',
})
export class StocksComponent {
  formData: any = {};
  dataSource!: STOCKSDetails[];
  sku: any[] = [];
  customer: any[] = [];
  loading: boolean = false;

  addPopUp: boolean = false;
  editPopUp: boolean = false;

  constructor(
    private configuration: StocksService
  ) // private skuService: SkuService
  {}

  ngOnInit(): void {
    this.getData();
    // this.getDataSku();
  }

  getData() {
    this.configuration.getStocksDetails().subscribe((data) => {
      this.dataSource = data;
      console.log(data);
    });
  }

  // getDataSku() {
  //   this.skuService.getSku().subscribe(
  //     data => {
  //       this.sku = data
  //       console.log(this.sku)
  //     }
  //   )
  // }

  onSubmit(e: any) {
    e.preventDefault();

    // Function For Checking Duplicate Name
    // if(this.configuration.checkDuplicateCategory(this.formData['PlantName'], this.dataSource))
    // {
    //   notify("Plant Name already exists!", "warning")
    //   return;
    // }
    // End Code Here

    this.configuration.addStocksDetails(this.formData).subscribe((data) => {
      this.formData = {};
      this.getData();
      notify('SKU Detail add successfully', 'success');
      this.addPopUp = false;
    });
  }

  onUpdate(e: any) {
    e.preventDefault();

    const updatedData = {
      SEQ_ID: Number(this.formData.SEQ_ID),
      SKU_SEQ_ID: Number(this.formData.SKU_SEQ_ID),
      STOCK_IN_PACKS: Number(this.formData.STOCK_IN_PACKS),
      STOCK_IN_BOTTELS: Number(this.formData.STOCK_IN_BOTTELS),
      MONTH: Number(this.formData.MONTH),
      ACTIVE: this.formData.ACTIVE ? 1 : 0,
      CREATED_BY: Number(this.formData.CREATED_BY),
    };

    console.log('Updated Data:', updatedData);

    this.configuration.updateStocksDetails(updatedData).subscribe(
      (data) => {
        this.formData = {};
        this.getData();
        notify('Stock updated successfully', 'success');
        this.editPopUp = false;
      },
      (error) => {
        console.error('Error updating Stock:', error);
        if (error.error) {
          console.error('API Error Response:', error.error);
        }
        notify('Error updating Stock', 'error');
      }
    );
  }

  onEdit(e: any) {
    this.formData = Object.assign({}, e);
    this.editPopUp = true;
  }

  onDelete(e: any) {
    if (!confirm('Are you sure you want to delete entry?')) return;

    this.configuration.deleteStocksDetails(e.SEQ_ID).subscribe((data) => {
      this.getData();
      notify('SKU Detail delete successfully', 'success');
    });
  }

  openAddForm() {
    this.formData = {};
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
