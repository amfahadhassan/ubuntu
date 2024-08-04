import { Component, Input, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ChartConfig } from 'src/app/models';
import { ChartService } from 'src/app/services';
import { CHART_TYPE } from 'src/app/utils';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements AfterViewInit {
  @Input() config: ChartConfig = {
    url: '',
    chartID: '',
    tblID: '',
    filterOptions: {},
    chartSpanText: '',
    tableSpanText: ''
  };

  chartElementId: string = '';
  tableElementId: string = '';

  private chartInstance: any;
  private tableInstance: any;

  selectedFilters: { [key: string]: string[] } = {};

  constructor(private chartService: ChartService, private cdr: ChangeDetectorRef) { }

  async ngAfterViewInit(): Promise<void> {
    this.chartElementId = this.generateUniqueId(CHART_TYPE.CHART);
    this.tableElementId = this.generateUniqueId(CHART_TYPE.TABLE);

    this.cdr.detectChanges();

    this.chartInstance = await this.chartService.createSingleChart(this.config.url, this.config.chartID);
    this.tableInstance = await this.chartService.createSingleChart(this.config.url, this.config.tblID);

    await this.renderChart(this.chartInstance, this.chartElementId);
    await this.renderChart(this.tableInstance, this.tableElementId);
  }

  private generateUniqueId(prefix: string): string {
    return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async renderChart(instance: any, elementId: string) {
    if (instance) {
      try {
        await instance.render(document.getElementById(elementId)!);
      } catch {
        window.alert('Chart failed to render');
      }
    }
  }

  async onFilterChange(filters: { [key: string]: string[] }) {
    const mongoDBFilter = this.convertToMongoDBFilter(filters);

    console.log('Applying MongoDB Filter:', mongoDBFilter);

    try {
      if (this.chartInstance) {
        await this.updateVisualization(this.chartInstance, mongoDBFilter);
      }
      if (this.tableInstance) {
        await this.updateVisualization(this.tableInstance, mongoDBFilter);
      }
    } catch (error) {
      console.error('Error updating visualization:', error);
      window.alert('Failed to update visualization');
    }
  }

  private convertToMongoDBFilter(filters: { [key: string]: string[] }): any {
    const mongoDBFilter: any = {};

    for (const [key, selectedOptions] of Object.entries(filters)) {
      if (selectedOptions.length > 0) {
        mongoDBFilter[key] = { $in: selectedOptions };
      } else {
        mongoDBFilter[key] = {}; // Apply no filter if empty
      }
    }

    return mongoDBFilter;
  }

  private async updateVisualization(instance: any, filters: any) {
    if (instance) {
      try {
        await instance.setFilter(filters);
      } catch (error) {
        console.error('Failed to set filter:', error);
        window.alert('Failed to set filter');
      }
    }
  }

//   ngAfterViewInit(): void {
//     this.chartElementId = this.generateUniqueId(ChartType.Chart);
//     this.tableElementId = this.generateUniqueId(ChartType.Table);

//     this.cdr.detectChanges();

//     this.renderChart(ChartType.Chart, this.config.chartID, this.chartElementId);
//     this.renderChart(ChartType.Table, this.config.tblID, this.tableElementId);
//   }

//   /**
//    * Generates Unique ID for chart instance
//    * @param prefix 
//    * @returns Unique ID
//    */
//   private generateUniqueId(prefix: string): string {
//     return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
//   }

//   /**
//    * Render Chart instance
//    * @param type 
//    * @param id 
//    * @param elementId 
//    */
//   private async renderChart(type: ChartType, id: string, elementId: string) {
//     const instance = this.chartService.createSingleChart(this.config.url, id);

//     try {
//       await instance.render(document.getElementById(elementId)!);
//       if (type === ChartType.Chart) {
//         this.chartInstance = instance;
//         console.log(await this.chartInstance.getData())
//       } else {
//         this.tableInstance = instance;
//       }
//     } catch {
//       window.alert(`${type.charAt(0).toUpperCase() + type.slice(1)} failed to initialise`);
//     }
//   }

//   private cleanUpInstance(instance: any) {
//     if (instance) {
//       instance.destroy();
//     }
//   }

//   async onFilterChange(selectedOptions: string[]) {
//     const filter = selectedOptions.length === 0 ? {} : {
//       disputeType: {
//         $in: selectedOptions
//       }
//     };
// console.log(selectedOptions)
//     if (this.chartInstance) {
//       this.chartInstance.setFilter(filter);
//     }
//   }

//   ngOnDestroy(): void {
//     this.cleanUpInstance(this.chartInstance);
//     this.cleanUpInstance(this.tableInstance);
//   }
}
