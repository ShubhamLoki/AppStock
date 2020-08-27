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

  ngOnInit(): void {
    if (this.localStockArray.length <= 0) {
      this.heikenAshiService.StocksQuoteArrayMap.forEach(
        (qouteArray: StockData[], stockName) => {
          const lastIdex = qouteArray.length - 1;
          const lastStockData: StockData = qouteArray[lastIdex];
          const secLastStockData: StockData = qouteArray[lastIdex - 1];
          if (lastStockData.rsi >= 55 && secLastStockData.rsi <= 55) {
            this.localStockArray.push({
              stock: stockName,
              stockObj: lastStockData,
            });
          }
        }
      );
    }
  }
}
