import { Component, OnInit } from '@angular/core';
import {
  DxButtonModule,
  DxDataGridModule,
  DxFormModule,
  DxPopupModule,
  DxSelectBoxModule,
} from 'devextreme-angular';
import { saveAs } from 'file-saver';
import {
  SKURecipe,
  SkuRecipeService,
} from '../../../shared/services/sku-recipe.service';
import { SkuService } from '../../../shared/services/sku.service';
import notify from 'devextreme/ui/notify';
import { DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import { Workbook } from 'exceljs';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { AuthService } from '../../../shared/services/auth.service';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-sku-recipe',
  standalone: true,
  imports: [
    DxDataGridModule,
    DxPopupModule,
    DxFormModule,
    DxButtonModule,
    DxSelectBoxModule,
  ],
  templateUrl: './sku-recipe.component.html',
  styleUrl: './sku-recipe.component.scss',
})
export class SkuRecipeComponent implements OnInit {
  formData: any = {};
  dataSource!: SKURecipe[];
  sku: any[] = [];
  customer: any[] = [];
  loading: boolean = false;
  recipeNames: any[] = [];
  selectedRecipeName: string = '';
  filteredDataSource: any[] = [];
  authsource: any;

  addPopUp: boolean = false;
  editPopUp: boolean = false;

  constructor(
    private configuration: SkuRecipeService,
    // private skuService: SkuService
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getData();
    // this.getDataSku();
    this.fetchRecipeNames();
  }

  fetchRecipeNames() {
    this.configuration.getSkuRecipe().subscribe(
      (data: any[]) => {
        this.recipeNames = [
          { RECIPE_NAME: 'Show All' },
          ...data.map((item) => ({ RECIPE_NAME: item.RECIPE_NAME })),
        ];
      },
      (error) => {
        console.error('Error fetching recipe names', error);
      }
    );
  }

  selectRecipeName(event: any) {
    this.selectedRecipeName = event.value;
    if (this.selectedRecipeName === 'Show All') {
      this.filteredDataSource = this.dataSource;
    } else {
      this.filteredDataSource = this.dataSource.filter(
        (data) => data.RECIPE_NAME === this.selectedRecipeName
      );
    }
  }

  getData() {
    this.configuration.getSkuRecipe().subscribe((data) => {
      this.dataSource = data;
      this.filteredDataSource = data;
      console.log(data);
    });
  }

  getusername() {
    this.authsource = this.authService.getGroupName();
  }
  // getDataSku() {
  //   this.skuService.getSku().subscribe((data) => {
  //     this.sku = data;
  //     console.log(this.sku);
  //   });
  // }

  onSubmit(e: any) {
    e.preventDefault();
    this.configuration.addSkuRecipe(this.formData).subscribe(
      (data) => {
        this.formData = {};
        this.getData();
        notify('SKU Recipe added successfully', 'success');
        this.addPopUp = false;
      },
      (error) => {
        console.error('Error adding SKU Recipe:', error);
        notify('Error adding SKU Recipe', 'error');
      }
    );
  }

  onUpdate(e: any) {
    e.preventDefault();

    const updatedData = {
      SEQ_ID: Number(this.formData.SEQ_ID),
      AUG_SKU_SEQ_ID: Number(this.formData.AUG_SKU_SEQ_ID),
      RECIPE_NAME: this.formData.RECIPE_NAME,
      RECIPE_DESCRIPTION: this.formData.RECIPE_DESCRIPTION,
      ACTIVE: Boolean(this.formData.ACTIVE),
      CREATED_BY: Number(this.formData.CREATED_BY),
    };

    console.log('Updated Data:', updatedData);

    this.configuration.updateSkuRecipe(updatedData).subscribe(
      (data) => {
        this.formData = {};
        this.getData();
        notify('SKU Recipe updated successfully', 'success');
        this.editPopUp = false;
      },
      (error) => {
        console.error('Error updating SKU Recipe:', error);
        if (error.error) {
          console.error('API Error Response:', error.error); // Log the API error response
        }
        notify('Error updating SKU Recipe', 'error');
      }
    );
  }

  onEdit(e: any) {
    this.formData = Object.assign({}, e);
    this.editPopUp = true;
  }

  onDelete(e: any) {
    if (!confirm('Are you sure you want to delete entry?')) return;

    this.configuration.deleteSkuRecipe(e.SEQ_ID).subscribe(
      (data) => {
        this.getData();
        notify('SKU Recipe deleted successfully', 'success');
      },
      (error) => {
        console.error('Error deleting SKU Recipe:', error);
        notify('Error deleting SKU Recipe', 'error');
      }
    );
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
