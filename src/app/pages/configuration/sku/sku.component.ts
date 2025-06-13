import { Component, OnInit, ViewChild } from '@angular/core';
import notify from 'devextreme/ui/notify';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import { exportDataGrid } from 'devextreme/excel_exporter';
import {
  DxDataGridModule,
  DxDataGridTypes,
} from 'devextreme-angular/ui/data-grid';
import { SkuService, SKU } from '../../../shared/services/sku.service';
import {
  DxPopupModule,
  DxFormModule,
  DxButtonModule,
} from 'devextreme-angular';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-sku',
  templateUrl: './sku.component.html',
  styleUrl: './sku.component.scss',
  standalone: true,
  imports: [DxDataGridModule, DxPopupModule, DxFormModule, DxButtonModule],
})
export class SkuComponent implements OnInit {
  formData: any = {};
  dataSource!: SKU[];
  loading: boolean = false;
  addPopUp: boolean = false;
  editPopUp: boolean = false;

  @ViewChild('bindingform') bindingform!: NgForm;

  constructor(private skuService: SkuService) {}

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.skuService.getSku().subscribe((data) => {
      this.dataSource = data;
      console.log(data);
    });
  }

  onSubmit(e: any) {
    e.preventDefault();

    if (
      this.skuService.checkDuplicateSku(
        this.formData['SKU_NAME'],
        this.dataSource
      )
    ) {
      notify('SKU Name already exists!', 'warning');
      return;
    }

    this.skuService.addSku(this.formData).subscribe((data) => {
      this.formData = {};
      this.getData();
      notify('SKU Save successfully', 'success');
      this.addPopUp = false;
    });
  }

  onUpdate(e: any) {
    e.preventDefault();

    this.skuService.updateSku(this.formData).subscribe((data) => {
      this.formData = {};
      this.getData();
      notify('SKU Update successfully', 'success');
      this.editPopUp = false;
    });
  }

  onEdit(e: any) {
    this.formData = Object.assign({}, e);
    this.editPopUp = true;
  }

  onDelete(e: any) {
    if (!confirm('Are you sure you want to delete entry?')) return;

    this.skuService.deleteSku(e.SEQ_ID).subscribe((data) => {
      this.getData();
      notify('SKU delete successfully', 'success');
    });
  }

  openAddForm() {
    this.formData = {};
    this.addPopUp = true;
  }

  onExporting(e: DxDataGridTypes.ExportingEvent) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('SKUs');

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
