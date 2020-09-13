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
  showYesAbove55StockList = false;
  showNear55StockList = false;
  showStockHistory = false;
  showAllAbove55 = false;

  historyStock = '';

  stockRSIArray = [];
  status = 'Loading...';

  analysisList = [];

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

  public openGoingAbove55(dayCount): void {
    this.analysisList = this.heikenAshiService.getAbove55(dayCount);
    this.showAllStockList = false;
    this.showNear55StockList = false;
    this.showStockHistory = false;
    this.showAllAbove55 = false;
    if (dayCount === 0) {
      this.showTodayAbove55StockList = true;
      this.showYesAbove55StockList = false;
    } else {
      this.showYesAbove55StockList = true;
      this.showTodayAbove55StockList = false;
    }
  }
  public openAll(): void {
    this.showAllStockList = true;
    this.showTodayAbove55StockList = false;
    this.showYesAbove55StockList = false;
    this.showNear55StockList = false;
    this.showStockHistory = false;
    this.showAllAbove55 = false;
  }
  public openNear55(): void {
    this.analysisList = this.heikenAshiService.getNear55();
    this.showAllStockList = false;
    this.showTodayAbove55StockList = false;
    this.showYesAbove55StockList = false;
    this.showNear55StockList = true;
    this.showStockHistory = false;
    this.showAllAbove55 = false;
  }

  public openHistory(stockName): void {
    this.historyStock = stockName;
    this.showStockHistory = true;
    this.showAllStockList = false;
    this.showTodayAbove55StockList = false;
    this.showYesAbove55StockList = false;
    this.showNear55StockList = false;
    this.showAllAbove55 = false;
  }

  openAllAbove55(): void {
    this.analysisList = this.heikenAshiService.getAllAbove55();
    this.showStockHistory = false;
    this.showAllStockList = false;
    this.showTodayAbove55StockList = false;
    this.showYesAbove55StockList = false;
    this.showNear55StockList = false;
    this.showAllAbove55 = true;
  }
}
