import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule, NgFor } from '@angular/common';
import { Units, UnitsService } from '../../../shared/services/units.service';
import { UtilitiesService } from '../../../shared/services/utilities.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { BidiModule } from '@angular/cdk/bidi';
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

@Component({
  selector: 'app-units',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    NgSelectModule,
    BidiModule,
    DxDataGridModule,
    DxButtonModule,
    DxPopupModule,
    DxFormModule,
  ],
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.scss'],
})
export class UnitsComponent implements OnInit {
  formData: any = {};
  dataSource!: Units[];
  loading: boolean = false;
  addPopUp: boolean = false;
  editPopUp: boolean = false;

  @ViewChild('bindingform') bindingform!: NgForm;

  constructor(private unitService: UnitsService) {}

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.unitService.getRecord().subscribe((data) => {
      this.dataSource = data;
    });
  }

  onSubmit(e: any) {
    e.preventDefault();

    if (
      this.unitService.checkDuplicateSku(
        this.formData['UNIT_NAME'],
        this.dataSource
      )
    ) {
      notify('Unit Name already exists!', 'warning');
      return;
    }

    this.unitService.insert(this.formData).subscribe((data) => {
      this.formData = {};
      this.getData();
      notify('Unit Saved successfully', 'success');
      this.addPopUp = false;
    });
  }

  onUpdate(e: any) {
    e.preventDefault();

    this.unitService.update(this.formData).subscribe((data) => {
      this.formData = {};
      this.getData();
      notify('Unit Updated successfully', 'success');
      this.editPopUp = false;
    });
  }

  onEdit(e: any) {
    this.formData = Object.assign({}, e);
    this.editPopUp = true;
  }

  onDelete(e: any) {
    if (!confirm('Are you sure you want to delete entry?')) return;

    this.unitService.delete(e.SEQ_ID).subscribe((data) => {
      this.getData();
      notify('Unit deleted successfully', 'success');
    });
  }

  openAddForm() {
    this.formData = {};
    this.addPopUp = true;
  }

  onExporting(e: DxDataGridTypes.ExportingEvent) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Units');

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
