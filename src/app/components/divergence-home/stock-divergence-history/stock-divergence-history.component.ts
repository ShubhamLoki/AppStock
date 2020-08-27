import {
  StockDivergenceService,
  StockData,
} from 'src/app/services/stock.divergence.service';
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-stock-divergence-history',
  templateUrl: './stock-divergence-history.component.html',
  styleUrls: ['./stock-divergence-history.component.scss'],
})
export class StockDivergenceHistoryComponent implements OnInit {
  title = 'DemoApp';
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
        quoteArray.forEach((stock: StockData) => {
          if (stock.lowerStockData) {
            this.listArr.push(stock);
          }
        });
      });
  }

  // ! Not In Use
  localDivergence() {
    this.apiService.getData().subscribe((data: any) => {
      this.stockName = this.apiService.stock;
      this.listArr = [];
      console.log(data.chart.result[0].indicators.quote[0]);
      const listData: any = data.chart.result[0].indicators.quote[0];
      const timeStampArr: any = data.chart.result[0].timestamp;
      for (let i = 0; i <= timeStampArr.length - 1; i++) {
        let minLow = 0;
        let upMove = 0;
        let downMove = 0;
        let avgUpMove = 0;
        let avgDownMove = 0;

        if (i != 0) {
          let move = listData.close[i] - listData.close[i - 1];
          move = Math.round(move * 10000) / 10000;
          if (move > 0) {
            upMove = move;
          } else {
            downMove = Math.abs(move);
          }
        }
        this.listArr.push({
          time: timeStampArr[i],
          open: Math.round(listData.open[i] * 100) / 100,
          high: Math.round(listData.high[i] * 100) / 100,
          low: Math.round(listData.low[i] * 100) / 100,
          close: Math.round(listData.close[i] * 100) / 100,
          volume: Math.round(listData.volume[i] * 100) / 100,
          upMove: upMove,
          downMove: downMove,
        });
        if (this.listArr.length >= 14) {
          avgUpMove = 0;
          avgDownMove = 0;
          for (let avg = i - 13; avg < i; avg++) {
            avgUpMove += this.listArr[avg].upMove;
            avgDownMove += this.listArr[avg].downMove;
          }
          avgUpMove = avgUpMove / 14;
          avgDownMove = avgDownMove / 14;
        }
        const rs = avgUpMove / avgDownMove;
        let rsi = 0;
        if (avgDownMove > 0 || avgDownMove < 100) {
          rsi = 100 - 100 / (1 + rs);
        } else if (avgDownMove >= 100) {
          rsi = 100;
        }
        let diver = false;
        let minRSI = 0;
        let timeComp;
        if (this.listArr.length > 20) {
          for (
            let div = this.listArr.length - 20;
            div < this.listArr.length - 1;
            div++
          ) {
            if (minLow == 0) {
              minLow = this.listArr[div].low;
            }
            minLow = Math.min(minLow, this.listArr[div].low);
            console.log(minLow);
            if (minLow == this.listArr[div].low) {
              minRSI = this.listArr[div].rsi;
              timeComp = this.listArr[div].time;
            }
          }
        }

        if (
          minLow >= this.listArr[this.listArr.length - 1].low &&
          minRSI <= rsi
        ) {
          console.log(
            minLow,
            this.listArr[this.listArr.length - 1].low,
            minRSI,
            rsi
          );
          diver = true;
        } else {
          timeComp = null;
        }

        this.listArr[this.listArr.length - 1] = {
          ...this.listArr[this.listArr.length - 1],
          avgUpMove: Math.round(avgUpMove * 10000) / 10000,
          avgDownMove: Math.round(avgDownMove * 10000) / 10000,
          rs: Math.round(rs * 100) / 100,
          rsi: Math.round(rsi * 100) / 100,
          diver: diver,
          timeComp: timeComp,
          minLow: minLow,
        };
      }
      console.log(this.listArr);
      this.listArr.sort(function (x, y) {
        return y.time - x.time;
      });
    });
  }
}
