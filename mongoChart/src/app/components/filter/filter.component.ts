import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FilterConfig } from 'src/app/models';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  @Input() spanText: string = 'Filter value:';
  @Input() filterOptions: FilterConfig = {};
  @Output() filterChange = new EventEmitter<{ [key: string]: string[] }>();

  constructor() { }

  ngOnInit(): void {
  }

  selectedFilters: { [key: string]: string[] } = {};

  onFilterChange(filterKey: string, selectedOptions: string[]) {
    this.selectedFilters[filterKey] = selectedOptions;
    this.filterChange.emit(this.selectedFilters);
  }
}
