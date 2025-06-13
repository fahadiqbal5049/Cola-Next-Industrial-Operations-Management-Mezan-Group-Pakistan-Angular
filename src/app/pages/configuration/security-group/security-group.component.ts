import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { SecurityGroupService } from '../../../shared/services/security-group.service';
import { NgForm } from '@angular/forms';
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
import notify from 'devextreme/ui/notify';
import { SecurityGroup } from '../../../shared/models/security-group.model';

@Component({
  selector: 'app-security-group',
  templateUrl: './security-group.component.html',
  styleUrls: ['./security-group.component.scss'],
  standalone: true,
  imports: [DxDataGridModule, DxPopupModule, DxFormModule, DxButtonModule],
})
export class SecurityGroupComponent implements OnInit {
  loading: any;
  dataSource!: SecurityGroup[];
  addPopUp: boolean = false;
  editPopUp: boolean = false;

  group: SecurityGroup = new SecurityGroup();

  formData: any = {};

  @ViewChild('bindingform') bindingform!: NgForm;

  buttonOptions = {
    text: 'Submit',
    useSubmitBehavior: true,
  };

  constructor(
    private groupService: SecurityGroupService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getData();
    this.changeDetectorRef.detectChanges();
  }

  onExporting(e: DxDataGridTypes.ExportingEvent) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('SecurityGroups');

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
    this.groupService.getData().subscribe((data) => {
      this.dataSource = data;
      console.log(data);
    });
  }

  resetForm() {
    this.formData = {};
  }

  onSubmit(e: any) {
    e.preventDefault();

    this.groupService.addSecurityGroup(this.formData).subscribe((data) => {
      this.resetForm();
      this.getData();
      notify('Recorder Added Successfully', 'success');
      this.addPopUp = false;
    });
  }

  onUpdate(e: any) {
    e.preventDefault();

    this.groupService.updateSecurityGroup(this.formData).subscribe((data) => {
      this.resetForm();
      this.getData();
      notify('Recorder Updated Successfully', 'success');
      this.editPopUp = false;
    });
  }

  onEdit(e: any) {
    this.formData = Object.assign({}, e);
    this.editPopUp = true;
  }

  onDelete(e: any) {
    if (!confirm('Are you sure you want to delete entry?')) return;

    this.groupService.deleteSecurityGroup(e.SEQ_ID).subscribe((data) => {
      this.getData();
    });
  }

  openAddForm() {
    this.resetForm();
    this.addPopUp = true;
  }
}
