import { Injectable } from '@angular/core';
import ChartsEmbedSDK from "@mongodb-js/charts-embed-dom";
import { FilterConfig } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ChartService {
  private chartCache: Map<string, any> = new Map();

  constructor() { }

  // createSingleChart(baseUrl: string, chartId: string) {
  //   const sdk = new ChartsEmbedSDK({ baseUrl });

  //   // Check if chart data is already cached
  //   if (this.chartCache.has(chartId)) {
  //     return this.chartCache.get(chartId);
  //   }

  //   // Embed a new chart and cache it
  //   const chartInstance = sdk.createChart({
  //     chartId,
  //     height: "450px",
  //     width: "500px",
  //   });

  //   this.chartCache.set(chartId, chartInstance);
  //   return chartInstance;
  // }

  // // Method to clear cache (if needed)
  // clearCache() {
  //   this.chartCache.clear();
  // }
  async createSingleChart(url: string, chartId: string): Promise<any> {
    const sdk = new ChartsEmbedSDK({ baseUrl: url });
    return sdk.createChart({ chartId: chartId, height: '450px', width: '500px' });
  }

  async setFilter(instance: any, filter: any): Promise<void> {
    if (instance) {
      try {
        await instance.setFilter(filter);
      } catch {
        window.alert('Failed to set filter');
      }
    }
  }
}
