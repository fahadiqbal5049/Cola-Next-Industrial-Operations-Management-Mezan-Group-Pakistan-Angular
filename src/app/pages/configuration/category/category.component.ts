import { Component } from '@angular/core';
import notify from 'devextreme/ui/notify';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { DxDataGridModule, DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import { CategoryService, Category } from '../../../shared/services/category.service';
import { DxButtonModule, DxFormModule, DxPopupModule } from 'devextreme-angular';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [DxDataGridModule, DxPopupModule, DxFormModule, DxButtonModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent {

  formData: any = {};
  dataSource!: Category[];

  loading: boolean = false;

  addPopUp: boolean = false;
  editPopUp: boolean = false;

  constructor(private configuration: CategoryService) { }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.configuration.getCategory().subscribe(
      data => {
        console.log(data)
        this.dataSource = data
      }
    )
  }

  onSubmit(e: any) {
    e.preventDefault();
    // Function For Checking Duplicate Name
    if (this.configuration.checkDuplicateCategory(this.formData['CATEGORY_NAME'], this.dataSource)) {
      notify("Category Name already exists!", "warning")
      return;
    }
    // End Code Here

    this.configuration.addCategory(this.formData).subscribe(
      data => {
        this.formData = {};
        this.getData();
        notify("Category Save successfully", "success")
      }
    )
  }

  onUpdate(e: any) {
    e.preventDefault();
    // console.log(e)
    this.configuration.updateCategory(this.formData).subscribe(
      data => {
        this.formData = {};
        this.getData();
        notify("Category update successfully", "success")
      }
    )
  }

  onEdit(e: any) {
    console.log(e)
    this.formData = Object.assign({}, e);
    this.editPopUp = true;
  }

  onDelete(e: any) {
    console.log(e)
    if (!confirm('Are you sure you want to delete entry?'))
      return;

    this.configuration.deleteCategory(e.SEQ_ID).subscribe(
      data => {
        this.getData();
        notify("Category deleted successfully", "success")
      }
    )
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
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'DataGrid.xlsx');
      });
    });

  }

}
