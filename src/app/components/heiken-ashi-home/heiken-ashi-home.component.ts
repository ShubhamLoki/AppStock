import { INTERVALS } from './../../constants/app.constants';
// import { STOCK_LIST } from './../../constants/stocks.constants';
import { StockCalculationService } from './../../services/stock.calculation.service';
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
  showAllBelow35 = false;

  historyStock = '';

  stockRSIArray = [];
  status = 'Loading...';

  analysisList = [];

  constructor(
    public heikenAshiService: HeikenAshiService,
    private stockCalculationService: StockCalculationService
  ) {}

  ngOnInit(): void {
    this.heikenAshiService
      .getCurrentRSIOfAll()
      .then((stockRSIArray: []) => {
        this.status = 'Loaded!';
      })
      .catch((error) => {
        console.log(error);
      });
    // this.stockCalculationService
    //   .calculateRSI(STOCK_LIST.ADANIGREEN, INTERVALS.MO_1)
    //   .then((quoteArray) => {
    //     console.log(INTERVALS.MO_1, quoteArray[quoteArray.length - 1]);
    //   });
    // this.stockCalculationService
    //   .calculateRSI(STOCK_LIST.ADANIGREEN, INTERVALS.WK_1)
    //   .then((quoteArray) => {
    //     console.log(INTERVALS.WK_1, quoteArray[quoteArray.length - 1]);
    //   });
  }

  public openGoingAbove55(dayCount): void {
    this.analysisList = this.heikenAshiService.getAbove55(dayCount);
    this.showAllStockList = false;
    this.showNear55StockList = false;
    this.showStockHistory = false;
    this.showAllAbove55 = false;
    this.showAllBelow35 = false;

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
    this.showAllBelow35 = false;
  }
  public openNear55(): void {
    this.analysisList = this.heikenAshiService.getNear55();
    this.showAllStockList = false;
    this.showTodayAbove55StockList = false;
    this.showYesAbove55StockList = false;
    this.showNear55StockList = true;
    this.showStockHistory = false;
    this.showAllAbove55 = false;
    this.showAllBelow35 = false;
  }

  public openHistory(stockName): void {
    this.historyStock = stockName;
    this.showStockHistory = true;
    this.showAllStockList = false;
    this.showTodayAbove55StockList = false;
    this.showYesAbove55StockList = false;
    this.showNear55StockList = false;
    this.showAllAbove55 = false;
    this.showAllBelow35 = false;
  }

  openAllAbove55(): void {
    this.analysisList = this.heikenAshiService.getAllAbove55();
    this.showStockHistory = false;
    this.showAllStockList = false;
    this.showTodayAbove55StockList = false;
    this.showYesAbove55StockList = false;
    this.showNear55StockList = false;
    this.showAllAbove55 = true;
    this.showAllBelow35 = false;
  }
  openAllBelow35(): void {
    this.analysisList = this.heikenAshiService.getAllBelow35();
    this.showStockHistory = false;
    this.showAllStockList = false;
    this.showTodayAbove55StockList = false;
    this.showYesAbove55StockList = false;
    this.showNear55StockList = false;
    this.showAllAbove55 = false;
    this.showAllBelow35 = true;
  }
}
