import { Injectable } from '@angular/core';
import ChartsEmbedSDK from '@mongodb-js/charts-embed-dom';

@Injectable({
  providedIn: 'root',
})
export class ChartService {
  constructor() {}

  async createSingleChart(url: string, chartId: string): Promise<any> {
    const sdk = new ChartsEmbedSDK({ baseUrl: url });
    return sdk.createChart({
      chartId: chartId,
      height: '450px',
      width: '500px',
    });
  }
}
