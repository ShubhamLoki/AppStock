import { CommonService } from './common.service';
import { StockData } from './stock.divergence.service';
import { ApiService } from './rest-api/api.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StockCalculationService {
  rsiInterval = 14;
  constructor(private apiService: ApiService) {}

  calculateRSI(stockName, timeInterval): Promise<any> {
    const returnPromise = new Promise((resolve, reject) => {
      console.log(timeInterval);

      this.apiService
        .getStockHistoryData(stockName, timeInterval, 1560592080)
        .subscribe((data: any) => {
          if (!data) {
            reject();
          }
          const quoteArray = [];
          const result = data.chart.result[0];
          const listData: any = result.indicators.quote[0];
          const timeStampArr: any = result.timestamp;

          // * calculate upMove = +(close.i - close.i-1) and downMove = -(close.i - close.i-1)
          // * calculate avgUpMove = +N-UpMove/N and avgDownMove = +N-DownMove/N
          // * calculate RS = avgUpMove / avgDownMove
          // * calculate RSI = 100 - (100 / (1+rs) )
          // * calculate Divergence = (Last min low > curr low && last RSI < curr RSI)
          timeStampArr.forEach((timeStamp, timeIndex) => {
            let upMove = 0;
            let downMove = 0;
            let avgUpMove = 0;
            let avgDownMove = 0;
            let currRSI = 0;
            let currRS = 0;

            const stockData: StockData = new StockData();
            // * calculate upMove & downMove
            if (timeIndex != 0) {
              let move =
                listData.close[timeIndex] - listData.close[timeIndex - 1];
              move = CommonService.truncNumber(move * 100) / 100;
              if (move > 0) {
                upMove = move;
              } else {
                downMove = Math.abs(move);
              }
            }
            // CommonService.truncNumber(listData.open[timeIndex]);
            // * SET DATA
            stockData.open = CommonService.truncNumber(
              listData.open[timeIndex]
            );
            stockData.high = CommonService.truncNumber(
              listData.high[timeIndex]
            );
            stockData.low = CommonService.truncNumber(listData.low[timeIndex]);
            stockData.close = CommonService.truncNumber(
              listData.close[timeIndex]
            );
            stockData.volume = CommonService.truncNumber(
              listData.volume[timeIndex]
            );
            stockData.upMove = upMove;
            stockData.downMove = downMove;
            stockData.timeStamp = timeStamp;
            // * SET DATA
            quoteArray.push(stockData);
            // * Calculate avgUpMove & avgDownMove for last N move
            // * newval = (prevval * (period - 1) + newdata) / period.
            if (quoteArray.length > 2) {
              avgUpMove =
                (quoteArray[quoteArray.length - 2].avgUpMove *
                  (this.rsiInterval - 1) +
                  upMove) /
                this.rsiInterval;
              avgDownMove =
                (quoteArray[quoteArray.length - 2].avgDownMove *
                  (this.rsiInterval - 1) +
                  downMove) /
                this.rsiInterval;
            }
            // * Calculate RS and RSI
            currRS = avgUpMove / avgDownMove;
            if (avgDownMove > 0 || avgDownMove < 100) {
              currRSI = 100 - 100 / (1 + currRS);
            } else if (avgDownMove >= 100) {
              currRSI = 100;
            }
            // * SET DATA
            stockData.avgUpMove =
              CommonService.truncNumber(avgUpMove * 100) / 100;
            stockData.avgDownMove =
              CommonService.truncNumber(avgDownMove * 100) / 100;
            stockData.rs = CommonService.truncNumber(currRS);
            stockData.rsi = CommonService.truncNumber(currRSI);
            // * SET DATA
            quoteArray[quoteArray.length - 1] = stockData;
            // ! END timeStampArr.forEach
          });
          resolve(quoteArray);
        });
    });

    return returnPromise;
  }
}
