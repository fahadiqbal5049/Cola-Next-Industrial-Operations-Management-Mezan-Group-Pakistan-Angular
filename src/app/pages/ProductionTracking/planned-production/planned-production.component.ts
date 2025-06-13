import { Component } from '@angular/core';
import { DxDataGridModule, DxPopupModule, DxFormModule, DxButtonModule } from 'devextreme-angular';
import { DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { Workbook } from 'exceljs';
import saveAs from 'file-saver';
import { Router } from '@angular/router';
import { ProductionService } from '../../../shared/services/production.service';

@Component({
  selector: 'app-planned-production',
  standalone: true,
  imports: [DxDataGridModule, DxPopupModule, DxFormModule, DxButtonModule],
  templateUrl: './planned-production.component.html',
  styleUrl: './planned-production.component.scss'
})
export class PlannedProductionComponent {
  loading: any
  dataSource: any
  constructor(private productionService: ProductionService,private router:Router) { }

  ngOnInit(): void {
    this.getData();
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
    this.productionService.getPlannedProduction().subscribe(
      data => {
        this.dataSource = data
      }
    )
  }
  openAddForm(){
    this.router.navigate(['generate-plan'])
  }
}
