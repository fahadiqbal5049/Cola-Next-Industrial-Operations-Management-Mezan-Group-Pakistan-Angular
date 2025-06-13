import { Component, OnInit } from '@angular/core';
import { PageAutorizationService } from '../../../shared/services/page-autorization.service';
import notify from 'devextreme/ui/notify';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { DxDataGridModule, DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import { DxPopupModule, DxFormModule, DxButtonModule, DxSelectBoxModule } from 'devextreme-angular';
import { DxiItemModule } from 'devextreme-angular/ui/nested';
import { SecurityGroupService } from '../../../shared/services/security-group.service';



@Component({
  selector: 'app-page-authorization',
  templateUrl: './page-authorization.component.html',
  styleUrls: ['./page-authorization.component.scss'],
  standalone: true,
  imports: [DxDataGridModule, DxPopupModule, DxFormModule, DxButtonModule, DxiItemModule, DxSelectBoxModule],
})
export class PageAuthorizationComponent {



  constructor(
    private Autorization: PageAutorizationService,
    private securityGroupService: SecurityGroupService

  ) { }
  loading: any;
  dataSource: any[] = [];
  addPopUp: boolean = false;
  editPopUp: boolean = false;
  component!: number;

  SecurityGroups: any[] = [];
  Modules: any[] = [];
  FilterNewComponents: any[] = [];
  filteredComponents: any[] = [];
  getComponent!: any[];

  //department: Department = new Department();

  formData: any = {};

  buttonOptions = {
    text: "Submit",
    useSubmitBehavior: true
  }

  ngOnInit(): void {
    this.getData();
    this.getmodules();
    this.getComponents();
    this.getsecuritygroups();
    //this.getComponentsForFilter();
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
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'DataGrid.xlsx');
      });
    });

  }

  getData() {
    this.Autorization.getBlockedComponent().subscribe(
      data => {
        this.dataSource = data
      }
    )
  }

  getmodules() {
    this.Autorization.getModules().subscribe(
      data => {
        console.log(data)
        this.Modules = data
      }
    )
  }

  getComponentsForFilter() {
    this.Autorization.getModulesForFilter().subscribe(
      data => {
        //console.log(data)
        this.FilterNewComponents = data
      }
    )
  }

  getComponents() {
    this.Autorization.getSecurityComponents().subscribe(
      data => {
        console.log(data)
        this.getComponent = data
      }
    )
  }

  getsecuritygroups() {
    this.securityGroupService.getData().subscribe(
      data => {
        this.SecurityGroups = data
      }
    )
  }

  resetForm() {
    this.formData = {}
  }

  onSubmit(e: any) {
    e.preventDefault();
    var obj = {
      SECURITY_GROUP_SEQ_ID: this.formData.SECURITY_GROUP_SEQ_ID,
      MODULE_SEQ_ID: this.ModeleSeqId,
      COMPONENT_SEQ_ID: this.formData.COMPONENT_SEQ_ID
    }
    console.log(obj)

    var checkDplication = this.dataSource.filter(f=> f.SECURITY_GROUP_SEQ_ID == obj.SECURITY_GROUP_SEQ_ID && f.COMPONENT_SEQ_ID == obj.COMPONENT_SEQ_ID)
    if(checkDplication.length>0){
      notify('ecord Already Exists','warning')
    }else{
 
    this.Autorization.addBlockedComponent(obj).subscribe(
      data => {
        notify("Saved Successfully", "success");

        // if (data == 1) {
        //   notify("Saved Successfully", "success");
        // }
        // else {
        //   notify("Record Already Exists", "warning");
        // }
        this.resetForm();
        this.getData();
      }
    )
  }
  }

  onUpdate(e: any) {
    e.preventDefault();
    this.Autorization.updateBlockedComponent(this.formData).subscribe(
      data => {
        this.resetForm();
        this.getData();
        notify("Updated Successfully", "success");

        this.editPopUp = false;
      }
    )
  }

  onEdit(e: any) {
    console.log(e);
    this.formData = Object.assign({}, e);
    this.editPopUp = true;
  }

  onDelete(e: any) {
    if (!confirm('Are you sure you want to delete entry?'))
      return;

    this.Autorization.deleteBlockedComponent(e.SEQ_ID).subscribe(
      data => {
        this.getData();
      }
    )
  }
  ModeleSeqId: any
  openAddForm() {
    this.resetForm();
    this.addPopUp = true;
  }

  onModuleSelected(e: any) {
    console.log(e);
    this.component = e.value;
    this.ModeleSeqId = e.value
    this.filteredComponents = this.Autorization.getComponentsFromModule(e.value, this.getComponent)
  }
}
