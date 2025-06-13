import { Component } from '@angular/core';
import {
  ShiftdetailsService,
  SHIFTSDetails,
} from '../../../shared/services/shiftdetails.service';
import {
  DxButtonModule,
  DxDataGridModule,
  DxFormModule,
  DxPopupModule,
} from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import { Workbook } from 'exceljs';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { saveAs } from 'file-saver';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-shiftdetails',
  standalone: true,
  imports: [
    DxDataGridModule,
    DxPopupModule,
    DxFormModule,
    DxButtonModule,
    CommonModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './shiftdetails.component.html',
  styleUrl: './shiftdetails.component.scss',
})
export class ShiftdetailsComponent {
  formData: any = {};
  dataSource!: SHIFTSDetails[];
  sku: any[] = [];
  customer: any[] = [];
  loading: boolean = false;

  addPopUp: boolean = false;
  editPopUp: boolean = false;

  constructor(
    private configuration: ShiftdetailsService
  ) // private skuService: SkuService
  {}

  ngOnInit(): void {
    this.getData();
    // this.getDataSku();
  }

  getData() {
    this.configuration.getShiftsDetails().subscribe((data) => {
      this.dataSource = data;
      console.log('Fetched Data:', data);
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

  onTimeChange(e: any) {
    const date = new Date(e.value);
    const utcTime = date.toISOString().split('T')[1].split('.')[0];
    e.component.option('value', utcTime);
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
    console.log('START_TIME:', this.formData.START_TIME, typeof this.formData.START_TIME);
    console.log('END_TIME:', this.formData.END_TIME, typeof this.formData.END_TIME);

    const formData = {
      ...this.formData,
      START_TIME: this.convertToISOTime(this.formData.START_TIME),
      END_TIME: this.convertToISOTime(this.formData.END_TIME),
      ACTIVE: this.formData.ACTIVE,
    };

    this.configuration.addShiftsDetails(formData).subscribe((data) => {
      this.formData = {};
      this.getData();
      notify('SKU Detail add successfully', 'success');
      this.addPopUp = false;
    });
  }

  onUpdate(e: any) {
    e.preventDefault();

    console.log('START_TIME:', this.formData.START_TIME, typeof this.formData.START_TIME);
    console.log('END_TIME:', this.formData.END_TIME, typeof this.formData.END_TIME);

    const updatedData = {
      SEQ_ID: Number(this.formData.SEQ_ID),
      SHIFT_NAME: this.formData.SHIFT_NAME,
      START_TIME: this.convertToISOTime(this.formData.START_TIME),
      END_TIME: this.convertToISOTime(this.formData.END_TIME),
      ACTIVE: this.formData.ACTIVE,
    };
    console.log('Updated Data:', updatedData);

    this.configuration.updateShiftsDetails(updatedData).subscribe(
      (data) => {
        console.log('API Response:', data);

        // Update the local dataSource with the updated data
        const updatedIndex = this.dataSource.findIndex(
          (item) => item.SEQ_ID === updatedData.SEQ_ID
        );
        if (updatedIndex !== -1) {
          this.dataSource[updatedIndex] = { ...this.dataSource[updatedIndex], ...updatedData };
        }

        this.formData = {};
        this.editPopUp = false;
        notify('Shift Detail updated successfully', 'success');
        this.editPopUp = false;
      },
      (error) => {
        console.error('Error updating Shift Detail:', error);
        notify('Error updating Shift Detail', 'error');
      }
    );
  }

  convertToISOTime(time: string | Date): string {
    if (!time) return '';

    let date = new Date(time);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  onEdit(e: any) {
    this.formData = {
      ...e,
      START_TIME: new Date(`1970-01-01T${e.START_TIME}`), // Convert to Date object
      END_TIME: new Date(`1970-01-01T${e.END_TIME}`), // Convert to Date object
      ACTIVE: e.ACTIVE, // Keep boolean value
    };
    this.editPopUp = true;
  }

  onDelete(e: any) {
    if (!confirm('Are you sure you want to delete entry?')) return;

    this.configuration.deleteShiftsDetails(e.SEQ_ID).subscribe((data) => {
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

  activeCellTemplate(cellElement: any, cellInfo: any) {
    cellElement.innerText = cellInfo.value ? 'Yes' : 'No';
  }
}
