import { Component, OnInit, Input } from '@angular/core';
import { HeikenAshiService } from 'src/app/services/heiken-ashi.service';
import { StockData } from 'src/app/services/stock.divergence.service';

@Component({
  selector: 'app-analysis-data',
  templateUrl: './analysis-data.component.html',
  styleUrls: ['./analysis-data.component.scss'],
})
export class AnalysisDataComponent implements OnInit {
  @Input() localStockArray = [];

  constructor(private heikenAshiService: HeikenAshiService) {}

  ngOnInit(): void {}
}
