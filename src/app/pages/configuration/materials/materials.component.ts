import { Component } from '@angular/core';
import {
  Materials,
  MaterialsService,
} from '../../../shared/services/materials.service';
import { saveAs } from 'file-saver';
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

@Component({
  selector: 'app-materials',
  standalone: true,
  imports: [DxDataGridModule, DxPopupModule, DxFormModule, DxButtonModule],
  templateUrl: './materials.component.html',
  styleUrl: './materials.component.scss',
})
export class MaterialsComponent {
  formData: any = {};
  dataSource!: Materials[];
  sku: any[] = [];
  customer: any[] = [];
  loading: boolean = false;

  addPopUp: boolean = false;
  editPopUp: boolean = false;

  constructor(
    private configuration: MaterialsService
  ) // private skuService: SkuService
  {}

  ngOnInit(): void {
    this.getData();
    // this.getDataSku();
  }

  getData() {
    this.configuration.getMaterials().subscribe((data) => {
      this.dataSource = data;
      console.log(data);
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

  onSubmit(e: any) {
    e.preventDefault();

    // Function For Checking Duplicate Name
    // if(this.configuration.checkDuplicateCategory(this.formData['PlantName'], this.dataSource))
    // {
    //   notify("Plant Name already exists!", "warning")
    //   return;
    // }
    // End Code Here
    this.configuration.addMaterials(this.formData).subscribe((data) => {
      this.formData = {};
      this.getData();
      notify('SKU Detail added successfully', 'success');
      this.addPopUp = false;
    });
  }

  onUpdate(e: any) {
    e.preventDefault();

    const updatedData = {
      SEQ_ID: Number(this.formData.SEQ_ID),
      AUG_UNIT_SEQ_ID: Number(this.formData.AUG_UNIT_SEQ_ID),
      ITEM_NAME: this.formData.ITEM_NAME,
      ITEM_DESCRIPTION: this.formData.ITEM_DESCRIPTION,
      ACTIVE: this.formData.ACTIVE ? 1 : 0, // Convert boolean to number
      MODIFIED_BY: Number(this.formData.MODIFIED_BY),
    };

    console.log('Updated Data:', updatedData);

    this.configuration.updateMaterials(updatedData).subscribe(
      (data) => {
        this.formData = {};
        this.getData();
        notify('Material updated successfully', 'success');
        this.editPopUp = false;
      },
      (error) => {
        console.error('Error updating Material:', error);
        if (error.error) {
          console.error('API Error Response:', error.error); // Log the API error response
        }
        notify('Error updating Material', 'error');
      }
    );
  }

  onEdit(e: any) {
    this.formData = Object.assign({}, e);
    this.editPopUp = true;
  }

  onDelete(e: any) {
    if (!confirm('Are you sure you want to delete entry?')) return;

    this.configuration.deleteMaterials(e.SEQ_ID).subscribe((data) => {
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
}
