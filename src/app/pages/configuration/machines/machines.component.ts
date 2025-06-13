import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MACHINES,
  MachineService,
} from '../../../shared/services/machine.service';
import { NgForm } from '@angular/forms';
import notify from 'devextreme/ui/notify';
import {
  DxDataGridModule,
  DxDataGridTypes,
} from 'devextreme-angular/ui/data-grid';
import { Workbook } from 'exceljs';
import { exportDataGrid } from 'devextreme/excel_exporter';
import {
  DxButtonModule,
  DxFormModule,
  DxPopupModule,
} from 'devextreme-angular';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-machines',
  standalone: true,
  imports: [DxDataGridModule, DxPopupModule, DxFormModule, DxButtonModule],
  templateUrl: './machines.component.html',
  styleUrl: './machines.component.scss',
})
export class MachinesComponent implements OnInit {
  formData: any = {};
  dataSource!: MACHINES[];
  loading: boolean = false;
  addPopUp: boolean = false;
  editPopUp: boolean = false;

  @ViewChild('bindingform') bindingform!: NgForm;

  constructor(private machineService: MachineService) {}

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.machineService.getMachines().subscribe((data) => {
      this.dataSource = data;
    });
  }

  onSubmit(e: any) {
    e.preventDefault();

    if (
      this.machineService.checkDuplicateMachines(
        this.formData['MACHINE_NAME'],
        this.dataSource
      )
    ) {
      notify('Machine Name already exists!', 'warning');
      return;
    }

    this.machineService.addMachines(this.formData).subscribe((data) => {
      this.formData = {};
      this.getData();
      notify('Machine Save successfully', 'success');
      this.addPopUp = false;
    });
  }

  onUpdate(e: any) {
    e.preventDefault();

    this.machineService.updateMachines(this.formData).subscribe((data) => {
      this.formData = {};
      this.getData();
      notify('Machine Update successfully', 'success');
      this.editPopUp = false;
    });
  }

  onEdit(e: any) {
    this.formData = Object.assign({}, e);
    this.editPopUp = true;
  }

  onDelete(e: any) {
    if (!confirm('Are you sure you want to delete entry?')) return;

    this.machineService.deleteMachines(e.SEQ_ID).subscribe((data) => {
      this.getData();
      notify('Machine delete successfully', 'success');
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
