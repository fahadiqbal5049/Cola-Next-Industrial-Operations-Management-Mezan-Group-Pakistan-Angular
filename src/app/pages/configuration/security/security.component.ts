import { Component, OnInit } from '@angular/core';
import { PageAutorizationService } from '../../../shared/services/page-autorization.service';
import notify from 'devextreme/ui/notify';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import { exportDataGrid } from 'devextreme/excel_exporter';
import {
  DxDataGridModule,
  DxDataGridTypes,
} from 'devextreme-angular/ui/data-grid';
import {
  DxPopupModule,
  DxFormModule,
  DxButtonModule,
} from 'devextreme-angular';
import { SecurityGroupService } from '../../../shared/services/security-group.service';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss'],
  standalone: true,
  imports: [DxDataGridModule, DxPopupModule, DxFormModule, DxButtonModule],
})
export class SecurityComponent {
  constructor(
    private pageAutorizationService: PageAutorizationService,
    private securityGroupService: SecurityGroupService
  ) {}
  loading: any;
  dataSource: any[] = [];
  addPopUp: boolean = false;
  editPopUp: boolean = false;

  SecurityGroups: any[] = [];
  Modules: any[] = [];

  //department: Department = new Department();

  formData: any = {};

  buttonOptions = {
    text: 'Submit',
    useSubmitBehavior: true,
  };

  ngOnInit(): void {
    this.getData();
    this.getmodules();
    // this.getsecuritygroups();
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

  getData() {
    this.pageAutorizationService.getSecurityComponents().subscribe((data) => {
      this.dataSource = data;
      console.log(data);
    });
  }

  getmodules() {
    this.pageAutorizationService.getModules().subscribe((data) => {
      this.Modules = data;
    });
  }

  getsecuritygroups() {
    this.securityGroupService.getData().subscribe((data) => {
      this.SecurityGroups = data;
    });
  }

  resetForm() {
    this.formData = {};
  }

  onSubmit(e: any) {
    e.preventDefault();

    this.pageAutorizationService
      .addSecurityComponents(this.formData)
      .subscribe((data: any) => {
        if (data == 1) {
          notify('Saved Successfully', 'success');
        } else {
          notify('Record Already Exists', 'warning');
        }
        this.resetForm();
        this.getData();
      });
  }

  onUpdate(e: any) {
    e.preventDefault();

    this.pageAutorizationService
      .updateSecurityComponents(this.formData)
      .subscribe((data) => {
        this.resetForm();
        this.getData();
        notify('Updated Successfully', 'success');

        this.editPopUp = false;
      });
  }

  onEdit(e: any) {
    console.log(e);
    this.formData = Object.assign({}, e);
    this.editPopUp = true;
  }

  onDelete(e: any) {
    if (!confirm('Are you sure you want to delete entry?')) return;

    this.pageAutorizationService
      .deleteSecurityComponents(e.SEQ_ID)
      .subscribe((data) => {
        this.getData();
      });
  }

  openAddForm() {
    this.resetForm();
    this.addPopUp = true;
  }
}
