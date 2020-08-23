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

  stockRSIArray = [];

  constructor(public heikenAshiService: HeikenAshiService) {}

  ngOnInit(): void {
    // const stockName = 'ASTRAL'; // TITAN
    // this.heikenAshiService
    //   .calculateHeikenAshi(stockName)
    //   .then((quoteArray) => {
    //     // console.log(quoteArray);
    //     this.stockList = quoteArray;
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });

    // this.heikenAshiService.calculateUpside(stockName);

    // this.heikenAshiService
    //   .fetchStockParallel()
    //   .then((allFetched) => {
    //     console.log(allFetched);
    //   })
    //   .catch((error) => {
    //     error(error);
    //   });

    this.heikenAshiService
      .getCurrentRSIOfAll()
      .then((stockRSIArray: []) => {
        console.log(stockRSIArray);
        // this.stockRSIArray = stockRSIArray;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  public openGoingAbove55() {
    this.showAllStockList = false;
    this.showTodayAbove55StockList = true;
    this.showNear55StockList = false;
  }
  public openAll() {
    this.showAllStockList = true;
    this.showTodayAbove55StockList = false;
    this.showNear55StockList = false;
  }
  public openNear55() {
    this.showAllStockList = false;
    this.showTodayAbove55StockList = false;
    this.showNear55StockList = true;
  }
}
