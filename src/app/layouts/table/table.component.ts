import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { DxDataGridModule, DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import { ShiftService } from '../../shared/services/shift.service';
import { DxPopupModule, DxFormModule, DxButtonModule } from 'devextreme-angular';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  standalone:true,
  imports: [DxDataGridModule, DxPopupModule, DxFormModule, DxButtonModule,CommonModule],
})
export class TableComponent {

@Input() obj!:tableFormat
@Output() outputData = new EventEmitter<{data:any,type:string}>();


  loading: any
  dataSource!: any[];
  addPopUp: boolean = false;
  editPopUp: boolean = false;


  formData: any = {};

  buttonOptions = {
    text: "Submit",
    useSubmitBehavior: true
  }

  constructor(private departmentService: ShiftService) { }

  generatedColumns: any[] = [];

  ngOnInit(): void {

      this.generateColumns();
    
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
  generateColumns() {
    const sampleItem = this.obj.dataSource[0];  // Get the first item to inspect its keys
    const modefiedItem = sampleItem
    // delete modefiedItem.SeqId
    this.generatedColumns = Object.keys(modefiedItem).map(key => (
      {
      dataField: key,
      caption: this.formatCaption(key)
    }));
    
    // console.log(this.generatedColumns)
  }

  formatCaption(fieldName: string): string {
    return fieldName.replace(/([A-Z])/g, ' $1') // Add space before capital letters
                    .replace(/^./, str => str.toUpperCase()); // Capitalize first letter
  }
  // ngOnInit(): void {
  //   this.getData();
  // }

  getData() {
    this.departmentService.getShift().subscribe(
      data => {
        this.dataSource = data
        // console.log(data)
      }
    )
  }

  resetForm() {
    this.formData = {}
  }

  onSubmit(e: any) {
    const data={
      data:this.formData,
      type:'add'
    }
    e.preventDefault();
    // this.formData.StartTime = this.datePipe.transform(this.formData.StartTime, 'yyyy-MM-ddTHH:mm:ss.SSS')
    // this.formData.StopTime = this.datePipe.transform(this.formData.StopTime, 'yyyy-MM-ddTHH:mm:ss.SSS')
    this.outputData.emit(data);
    this.addPopUp=false;
    // this.formData.StartTime = this.datePipe.transform(this.formData.StartTime, 'yyyy-MM-ddTHH:mm:ss.SSS')
    // this.formData.StopTime = this.datePipe.transform(this.formData.StopTime, 'yyyy-MM-ddTHH:mm:ss.SSS')
    // this.departmentService.addShift(this.formData).subscribe(
    //   data => {
    //     this.resetForm();
    //     this.getData();
    //   }
    // )
  }

  onUpdate(e: any) {
    e.preventDefault();
    const data={
      data:this.formData,
      type:'update'
    }
    this.outputData.emit(data)
    this.editPopUp=false;
    // this.formData.StartTime = this.datePipe.transform(this.formData.StartTime, 'yyyy-MM-ddTHH:mm:ss.SSS')
    // this.formData.StopTime = this.datePipe.transform(this.formData.StopTime, 'yyyy-MM-ddTHH:mm:ss.SSS')
    // this.departmentService.updateShift(this.formData).subscribe(
    //   data => {
    //     this.resetForm();
    //     this.getData();

    //     this.editPopUp = false;
    //   }
    // )
  }

  onEdit(e: any) {
    this.formData = Object.assign({}, e);
    this.editPopUp = true;
    // console.log(e)
  }

  onDelete(e: any) {
    if (!confirm('Are you sure you want to delete entry?'))
      return;
    const data={
      data:e,
      type:'delete'
    }
    this.outputData.emit(data)
    // this.departmentService.deleteShift(e.SeqId).subscribe(
    //   data => {
    //     this.getData();
    //   }
    // )
  }

  openAddForm() {
    this.resetForm();
    this.addPopUp = true;
  }
}


export class tableFormat{
  columns!:any[]
  heading!:string
  dataSource!:any[]

}

