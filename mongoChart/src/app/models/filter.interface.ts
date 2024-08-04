export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  [key: string]: FilterOption[];
}
