import { Component, OnInit } from '@angular/core';
import { HeikenAshiService } from 'src/app/services/heiken-ashi.service';

@Component({
  selector: 'app-heiken-ashi-home',
  templateUrl: './heiken-ashi-home.component.html',
  styleUrls: ['./heiken-ashi-home.component.scss'],
})
export class HeikenAshiHomeComponent implements OnInit {
  stockList = [];

  showAllStockList = true;
  showTodayAbove55StockList = false;
  showNear55StockList = false;
  showStockHistory = false;

  historyStock = '';

  stockRSIArray = [];
  status = 'Loading...';

  near55List = [];

  constructor(public heikenAshiService: HeikenAshiService) {}

  ngOnInit(): void {
    this.heikenAshiService
      .getCurrentRSIOfAll()
      .then((stockRSIArray: []) => {
        this.status = 'Loaded!';
      })
      .catch((error) => {
        console.log(error);
      });
  }

  public openGoingAbove55(): void {
    this.showAllStockList = false;
    this.showTodayAbove55StockList = true;
    this.showNear55StockList = false;
    this.showStockHistory = false;
  }
  public openAll(): void {
    this.showAllStockList = true;
    this.showTodayAbove55StockList = false;
    this.showNear55StockList = false;
    this.showStockHistory = false;
  }
  public openNear55(): void {
    this.near55List = this.heikenAshiService.getNear55();
    this.showAllStockList = false;
    this.showTodayAbove55StockList = false;
    this.showNear55StockList = true;
    this.showStockHistory = false;
  }

  public openHistory(stockName): void {
    this.historyStock = stockName;
    this.showStockHistory = true;
    this.showAllStockList = false;
    this.showTodayAbove55StockList = false;
    this.showNear55StockList = false;
  }
}
