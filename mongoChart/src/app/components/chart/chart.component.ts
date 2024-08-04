import {
  Component,
  Input,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { ChartConfig } from 'src/app/models';
import { ChartService } from 'src/app/services';
import { CHART_TYPE } from 'src/app/utils';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements AfterViewInit, OnDestroy {
  @Input() config: ChartConfig = {
    url: '',
    chartID: '',
    tblID: '',
    filterLabel:[],
    filterOptions: {},
    chartSpanText: '',
    tableSpanText: '',
  };

  chartElementId: string = '';
  tableElementId: string = '';

  private chartInstance: any;
  private tableInstance: any;

  selectedFilters: { [key: string]: string[] } = {};

  constructor(
    private chartService: ChartService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngAfterViewInit(): Promise<void> {
    this.chartElementId = this.generateUniqueId(CHART_TYPE.CHART);
    this.tableElementId = this.generateUniqueId(CHART_TYPE.TABLE);

    this.cdr.detectChanges();

    this.chartInstance = await this.chartService.createSingleChart(
      this.config.url,
      this.config.chartID
    );
    this.tableInstance = await this.chartService.createSingleChart(
      this.config.url,
      this.config.tblID
    );

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

    try {
      if (this.chartInstance) {
        await this.filterChart(this.chartInstance, mongoDBFilter);
      }
      if (this.tableInstance) {
        await this.filterChart(this.tableInstance, mongoDBFilter);
      }
    } catch (error) {
      window.alert('Failed to update visualization');
    }
  }

  private convertToMongoDBFilter(filters: { [key: string]: string[] }): any {
    const mongoDBFilter: any = {};

    for (const [key, selectedOptions] of Object.entries(filters)) {
      if (selectedOptions.length > 0) {
        mongoDBFilter[key] = { $in: selectedOptions };
      }
    }

    return mongoDBFilter;
  }

  private async filterChart(instance: any, filters: any) {
    if (instance) {
      try {
        await instance.setFilter(filters);
      } catch (error) {
        window.alert('Failed to set filter');
      }
    }
  }

  ngOnDestroy(): void {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
    if (this.tableInstance) {
      this.tableInstance.destroy();
    }
  }

  async exportDataAsJSON() {
    try {
      const data = await this.chartInstance.getData(); // Get chart data
      const jsonBlob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(jsonBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'chart-data.json';
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      window.alert('Failed to export data');
    }
  }

  async exportDataAsCSV() {
    try {
      const data = await this.chartInstance.getData(); // Get chart data
      const csv = this.convertToCSV(data);
      const csvBlob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(csvBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'chart-data.csv';
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      window.alert('Failed to export data as CSV');
    }
  }

  private convertToCSV(json: any): string {
    const { documents, fields } = json;
    const headers = `${fields.label},${fields.value}`;
    const rows = documents.map((doc:any) => `${doc.label},${doc.value}`).join('\n');
    const csvContent = `${headers}\n${rows}`;
    return csvContent;
  }
}
