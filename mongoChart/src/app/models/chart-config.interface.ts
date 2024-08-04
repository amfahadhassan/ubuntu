import { FilterConfig } from ".";

export interface ChartConfig {
  url: string;
  chartID: string;
  tblID: string;
  filterOptions: FilterConfig;
  chartSpanText: string;
  tableSpanText: string;
}
