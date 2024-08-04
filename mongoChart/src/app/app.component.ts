import { Component } from '@angular/core';
import { ChartConfig } from './models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'mongoChart';
  chartConfigs: ChartConfig[] = [
    {
      url: 'https://charts.mongodb.com/charts-odr-drqqzdt',
      chartID: '66a1f26d-1e42-4993-8a5d-e385ace927e7',
      tblID: '66a1fad5-c235-4aed-8583-0522e009c1f7',
      filterLabel:['Dispute Type'],
      filterOptions: {
        disputeType: [
          { value: 'Small Claims', label: 'Small Claims' },
          { value: 'Family', label: 'Family' },
        ]
      },
      chartSpanText: 'Front Card Filter',
      tableSpanText: 'Back Card Filter',
    },
    {
      url: 'https://charts.mongodb.com/charts-odr-drqqzdt',
      chartID: '66accf31-2c31-4b12-8ea4-63e5d0ebf6aa',
      tblID: '66accfb7-f5f4-46b8-82f7-591ae9b86a8a',
      filterLabel:['Dispute Type', 'Court'],
      filterOptions: {
        disputeType: [
          { value: 'Small Claims', label: 'Small Claims' },
          { value: 'Family', label: 'Family' },
        ],
        referredToODRBy: [
          { value: 'Arapahoe County Court', label: 'Arapahoe County Court' },
          { value: 'Clark County Court', label: 'Clark County Court' },
        ]
      },
      chartSpanText: 'Front Card Filter',
      tableSpanText: 'Back Card Filter',
    },
  ];
}
