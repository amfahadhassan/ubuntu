import {
  Component,
  Input,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef
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
    filterLabel: [],
    filterOptions: {},
    chartSpanText: '',
    tableSpanText: '',
  };

  chartElementId: string;
  tableElementId: string;
  private chartInstance: any;
  private tableInstance: any;

  selectedFilters: { [key: string]: string[] } = {};

  constructor(
    private chartService: ChartService,
    private cdr: ChangeDetectorRef
  ) {
    this.chartElementId = this.generateUniqueId(CHART_TYPE.CHART);
    this.tableElementId = this.generateUniqueId(CHART_TYPE.TABLE);
  }

  /**
   * Lifecycle hook that is called after the component's view has been fully initialized.
   * Creates and renders the chart and table instances.
   */
  async ngAfterViewInit(): Promise<void> {
    try {
      this.chartInstance = await this.createAndRenderChart(this.config.chartID, this.chartElementId);
      this.tableInstance = await this.createAndRenderChart(this.config.tblID, this.tableElementId);
    } catch (error) {
      window.alert('Failed to render charts');
    }
  }

  /**
   * Creates a chart instance and renders it into the specified element.
   * @param chartID ID of the chart to be created.
   * @param elementId ID of the HTML element where the chart will be rendered.
   * @returns The created chart instance.
   */
  private async createAndRenderChart(chartID: string, elementId: string) {
    const instance = await this.chartService.createSingleChart(this.config.url, chartID);
    await this.renderChart(instance, elementId);
    return instance;
  }

  /**
   * Renders a chart instance into the specified HTML element.
   * @param instance The chart instance to be rendered.
   * @param elementId ID of the HTML element where the chart will be rendered.
   */
  private async renderChart(instance: any, elementId: string) {
    try {
      await instance.render(document.getElementById(elementId)!);
    } catch (error) {
      window.alert('Failed to render chart');
    }
  }

  /**
   * Handles filter changes and updates the chart and table with the new filters.
   * @param filters The filters to be applied to the chart and table.
   */
  async onFilterChange(filters: { [key: string]: string[] }) {
    const mongoDBFilter = this.convertToMongoDBFilter(filters);

    try {
      await this.applyFilterToChart(this.chartInstance, mongoDBFilter);
      await this.applyFilterToChart(this.tableInstance, mongoDBFilter);
    } catch (error) {
      window.alert('Failed to update visualization');
    }
  }

  /**
   * Converts selected filters into MongoDB filter format.
   * @param filters The selected filters.
   * @returns The converted MongoDB filter.
   */
  private convertToMongoDBFilter(filters: { [key: string]: string[] }): any {
    const mongoDBFilter: any = {};

    for (const [key, selectedOptions] of Object.entries(filters)) {
      if (selectedOptions.length > 0) {
        mongoDBFilter[key] = { $in: selectedOptions };
      }
    }

    return mongoDBFilter;
  }

  /**
   * Applies the given filters to a chart instance.
   * @param instance The chart instance to be filtered.
   * @param filters The filters to be applied.
   */
  private async applyFilterToChart(instance: any, filters: any) {
    if (instance) {
      try {
        await instance.setFilter(filters);
      } catch (error) {
        window.alert('Failed to set filter');
      }
    }
  }

  /**
   * Lifecycle hook that is called when the component is about to be destroyed.
   * Cleans up chart and table instances.
   */
  ngOnDestroy(): void {
    this.destroyInstance(this.chartInstance);
    this.destroyInstance(this.tableInstance);
  }

  /**
   * Destroys a chart instance to free up resources.
   * @param instance The chart instance to be destroyed.
   */
  private destroyInstance(instance: any) {
    if (instance) {
      try {
        instance.destroy();
      } catch (error) {
        console.error('Failed to destroy chart instance', error);
      }
    }
  }

  /**
   * Exports the chart data as a JSON file.
   */
  async exportDataAsJSON() {
    await this.exportData('json', 'chart-data.json');
  }

  /**
   * Exports the chart data as a CSV file.
   */
  async exportDataAsCSV() {
    await this.exportData('csv', 'chart-data.csv');
  }

  /**
   * Exports the chart data in the specified format.
   * @param format The format to export the data in ('json' or 'csv').
   * @param fileName The name of the file to be downloaded.
   */
  private async exportData(format: 'json' | 'csv', fileName: string) {
    try {
      const data = await this.chartInstance.getData();
      const blob = format === 'json'
        ? new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
        : new Blob([this.convertToCSV(data)], { type: 'text/csv' });
      this.downloadBlob(blob, fileName);
    } catch (error) {
      window.alert(`Failed to export data as ${format.toUpperCase()}`);
    }
  }

  /**
   * Converts JSON data to CSV format.
   * @param json The JSON data to convert.
   * @returns The CSV string.
   */
  private convertToCSV(json: any): string {
    const { documents, fields } = json;
    const headers = `${fields.label},${fields.value}`;
    const rows = documents.map((doc: any) => `${doc.label},${doc.value}`).join('\n');
    return `${headers}\n${rows}`;
  }

  /**
   * Triggers the download of a file from a Blob object.
   * @param blob The Blob object containing the file data.
   * @param fileName The name of the file to be downloaded.
   */
  private downloadBlob(blob: Blob, fileName: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Generates a unique ID for chart or table elements.
   * @param prefix The prefix for the ID.
   * @returns The generated unique ID.
   */
  private generateUniqueId(prefix: string): string {
    return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
