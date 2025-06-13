import { Component, ViewChild } from '@angular/core';
import {
  DxButtonModule,
  DxDataGridModule,
  DxFormModule,
  DxPopupModule,
} from 'devextreme-angular';
import { saveAs } from 'file-saver';
import { MACHINES } from '../../../shared/services/machine.service';
import {
  MACHINECAPACITYDetails,
  MachineCapacityService,
} from '../../../shared/services/machine-capacity.service';
import notify from 'devextreme/ui/notify';
import { DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import { Workbook } from 'exceljs';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-machine-capacity',
  standalone: true,
  imports: [DxDataGridModule, DxPopupModule, DxFormModule, DxButtonModule],
  templateUrl: './machine-capacity.component.html',
  styleUrl: './machine-capacity.component.scss',
})
export class MachineCapacityComponent {
//   formData: any = {};
//   dataSource!: MACHINECAPACITYDetails[];
//   sku: any[] = [];
//   customer: any[] = [];
//   loading: boolean = false;

// addPopUp: boolean = false;
//   editPopUp: boolean = false;

//   constructor(private configuration: MachineCapacityService) {}

//   ngOnInit(): void {
//     this.getData();
//     this.getDataSku();
//   }

//   getData() {
//     this.configuration.getMachineCapacity().subscribe((data) => {
//       this.dataSource = data;
//       console.log(data);
//     });
//   }

//   getDataSku() {
//     this.configuration.getMachineCapacity().subscribe((data) => {
//       this.sku = data;
//       console.log(this.sku);
//     });
//   }

//   onSubmit(e: any) {
//     e.preventDefault();

//     // Function For Checking Duplicate Name
//     // if(this.configuration.checkDuplicateCategory(this.formData['PlantName'], this.dataSource))
//     // {
//     //   notify("Plant Name already exists!", "warning")
//     //   return;
//     // }
//     // End Code Here

//     this.configuration.addMachineCapacity(this.formData).subscribe((data) => {
//       this.formData = {};
//       this.getData();
//       notify('SKU Detail add successfully', 'success');
//     });
//   }

//   onUpdate(e: any) {
//     e.preventDefault();

//     this.configuration
//       .updateMachineCapacity(this.formData)
//       .subscribe((data) => {
//         this.formData = {};
//         this.getData();
//         notify('Machine Capacity update successfully', 'success');
//       });
//   }

//   onEdit(e: any) {
//     this.formData = Object.assign({}, e);
//     this.editPopUp = true;
//   }

//   onDelete(e: any) {
//     if (!confirm('Are you sure you want to delete entry?')) return;

//     this.configuration.deleteMachineCapacity(e.SEQ_ID).subscribe((data) => {
//       this.getData();
//       notify('SKU Detail delete successfully', 'success');
//     });
//   }

//   openAddForm() {
//     this.formData = {};
//     this.addPopUp = true;
//   }

//   onExporting(e: DxDataGridTypes.ExportingEvent) {
//     const workbook = new Workbook();
//     const worksheet = workbook.addWorksheet('Employees');

//     exportDataGrid({
//       component: e.component,
//       worksheet,
//       autoFilterEnabled: true,
//     }).then(() => {
//       workbook.xlsx.writeBuffer().then((buffer) => {
//         saveAs(
//           new Blob([buffer], { type: 'application/octet-stream' }),
//           'DataGrid.xlsx'
//         );
//       });
//     });
//   }

formData: any = {};
dataSource!: MACHINECAPACITYDetails[];
loading: boolean = false;
addPopUp: boolean = false;
editPopUp: boolean = false;


@ViewChild('bindingform') bindingform!: NgForm;

constructor(private machineService: MachineCapacityService) {}

ngOnInit(): void {
  this.getData();
}

getData() {
  this.machineService.getMachineCapacity().subscribe((data) => {
    this.dataSource = data;
  });
}

onSubmit(e: any) {
  e.preventDefault();

  // if (
  //   this.machineService.checkDuplicateMachines(
  //     this.formData['MACHINE_NAME'],
  //     this.dataSource
  //   )
  // ) {
  //   notify('Machine Name already exists!', 'warning');
  //   return;
  // }

  this.machineService.addMachineCapacity(this.formData).subscribe((data) => {
    this.formData = {};
    this.getData();
    notify('Machine Save successfully', 'success');
    this.addPopUp = false;
  });
}

onUpdate(e: any) {
  e.preventDefault();

  const updatedData = {
    SEQ_ID: Number(this.formData.SEQ_ID),
    AUG_MACHINE_SEQ_ID: Number(this.formData.AUG_MACHINE_SEQ_ID),
    AUG_SKU_SEQ_ID: Number(this.formData.AUG_SKU_SEQ_ID),
    HOURLY_CAPACITY_IN_BOTTLES: Number(this.formData.HOURLY_CAPACITY_IN_BOTTLES),
    SHIFT_CAPACITY_IN_BOTTLES: Number(this.formData.SHIFT_CAPACITY_IN_BOTTLES),
    ACTIVE: Number(this.formData.ACTIVE),
  };

  this.machineService.updateMachineCapacity(updatedData).subscribe(
    (data) => {
      this.formData = {};
      this.getData();
      notify('Machine Update successfully', 'success');
      this.editPopUp = false;
    },
    (error) => {
      console.error('Error:', error);
    }
  );
}

onEdit(e: any) {
  this.formData = Object.assign({}, e);
  this.editPopUp = true;
}

onDelete(e: any) {
  if (!confirm('Are you sure you want to delete entry?')) return;

  this.machineService.deleteMachineCapacity(e.SEQ_ID).subscribe((data) => {
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
