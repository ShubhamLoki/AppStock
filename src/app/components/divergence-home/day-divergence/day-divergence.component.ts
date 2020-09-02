import { Router } from '@angular/router';
import {
  StockDivergenceService,
  StockData,
} from 'src/app/services/stock.divergence.service';
import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-day-divergence',
  templateUrl: './day-divergence.component.html',
  styleUrls: ['./day-divergence.component.scss'],
})
export class DayDivergenceComponent implements OnInit {
  localMap = new Map();
  status = 'Loading...';
  showDataList = false;
  localArray: StockData[] = [];

  constructor(
    public stockDivergenceService: StockDivergenceService,
    public apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log(this.apiService.timeInterval);
    this.stockDivergenceService
      .fetchStockParallel(this.apiService.timeInterval)
      .then(() => {
        if (this.apiService.timeInterval === '1h') {
          this.localMap = this.stockDivergenceService.hourDivergenceMap;
        } else {
          this.localMap = this.stockDivergenceService.dayDivergenceMap;
        }
        this.localArray = [];
        this.localMap.forEach((stockData: StockData, stockName) => {
          stockData.stockName = stockName;
          this.localArray.push(stockData);
        });

        this.localArray.sort((a, b) => (a.timeStamp < b.timeStamp ? 1 : -1));
        console.log('Loaded***');
        this.status = 'Loaded!';
      });
  }

  openDivergence(stockName): void {
    this.apiService.stock = stockName;
    this.showDataList = true;
  }

  showDivergenceList(): void {
    this.showDataList = false;
  }
}
