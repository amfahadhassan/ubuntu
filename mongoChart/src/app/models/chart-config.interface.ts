import { FilterConfig } from ".";

export interface ChartConfig {
  url: string;
  chartID: string;
  tblID: string;
  filterLabel: string[];
  filterOptions: FilterConfig;
  chartSpanText: string;
  tableSpanText: string;
}
