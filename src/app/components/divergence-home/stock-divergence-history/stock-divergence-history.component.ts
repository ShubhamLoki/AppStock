import {
  StockDivergenceService,
  StockData,
} from 'src/app/services/stock.divergence.service';
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/rest-api/api.service';

@Component({
  selector: 'app-stock-divergence-history',
  templateUrl: './stock-divergence-history.component.html',
  styleUrls: ['./stock-divergence-history.component.scss'],
})
export class StockDivergenceHistoryComponent implements OnInit {
  listArr = [];
  stockName = '';
  constructor(
    public apiService: ApiService,
    public stockDivergenceService: StockDivergenceService
  ) {}

  ngOnInit(): void {
    this.stockDivergenceService
      .calculateDivergence(this.apiService.stock, this.apiService.timeInterval)
      .then((quoteArray) => {
        this.stockDivergenceService.calculateUpsideAfterDivergence(quoteArray);
        quoteArray.sort((a, b) => (a.timeStamp < b.timeStamp ? 1 : -1));
        quoteArray.forEach((stock: StockData) => {
          if (stock.lowerStockData) {
            this.listArr.push(stock);
          }
        });
      });
  }
}
