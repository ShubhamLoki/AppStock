import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { StockData } from './stock.divergence.service';

@Injectable({
  providedIn: 'root',
})
export class HeikenAshiService {
  rsiInterval = 14;
  upsideList = [];

  constructor(private apiService: ApiService) {}

  calculateHeikenAshi(stockName): Promise<any> {
    const returnPromise = new Promise((resolve, reject) => {
      this.apiService.timeInterval = '1d';

      this.apiService.getStockData(stockName).subscribe((data: any) => {
        console.log(data);

        if (!data) {
          reject();
        }

        const quoteArray = [];
        // console.log('************ ', stockName);
        const result = data.chart.result[0];
        const listData: any = result.indicators.quote[0];
        const timeStampArr: any = result.timestamp;

        // * calculate open = (open of previous bar + close of previous bar) / 2
        // * calculate close = (open + high + low + close) / 4
        // * calculate high = the maximum value from the high, open, or close of the current period
        // * calculate low = the minimum value from the low, open, or close of the current period
        timeStampArr.forEach((timeStamp, timeIndex) => {
          let upMove = 0;
          let downMove = 0;
          let avgUpMove = 0;
          let avgDownMove = 0;
          let currRSI = 0;
          let currRS = 0;

          const stockData: StockData = new StockData();
          const stockDataHA: StockData = new StockData();
          stockData.timeStamp = timeStamp;
          stockData.open = Math.round(listData.open[timeIndex] * 100) / 100;
          stockData.high = Math.round(listData.high[timeIndex] * 100) / 100;
          stockData.low = Math.round(listData.low[timeIndex] * 100) / 100;
          stockData.close = Math.round(listData.close[timeIndex] * 100) / 100;
          stockData.volume = Math.round(listData.volume[timeIndex] * 100) / 100;

          stockDataHA.timeStamp = timeStamp;
          stockDataHA.volume =
            Math.round(listData.volume[timeIndex] * 100) / 100;
          // console.log(quoteArray);
          if (quoteArray.length >= 1) {
            const lastStockData: StockData = quoteArray[quoteArray.length - 1];
            // OPEN
            stockDataHA.open = (lastStockData.open + lastStockData.close) / 2;
            stockDataHA.close =
              (stockData.open +
                stockData.high +
                stockData.low +
                stockData.close) /
              4;
            stockDataHA.high = Math.max(
              stockData.open,
              stockData.high,
              stockData.close
            );
            stockDataHA.low = Math.min(
              stockData.open,
              stockData.low,
              stockData.close
            );
            // * calculate upMove & downMove
            let move = stockDataHA.close - lastStockData.close;
            move = Math.round(move * 10000) / 10000;
            if (move > 0) {
              upMove = move;
            } else {
              downMove = Math.abs(move);
            }
            // console.log(move);

            stockDataHA.open = Math.round(stockDataHA.open * 100) / 100;
            stockDataHA.close = Math.round(stockDataHA.close * 100) / 100;
            stockDataHA.high = Math.round(stockDataHA.high * 100) / 100;
            stockDataHA.low = Math.round(stockDataHA.low * 100) / 100;
            stockDataHA.upMove = upMove;
            stockDataHA.downMove = downMove;
            quoteArray.push(stockDataHA);
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
            stockDataHA.avgUpMove = Math.round(avgUpMove * 100) / 100;
            stockDataHA.avgDownMove = Math.round(avgDownMove * 100) / 100;
            stockDataHA.rs = Math.round(currRS * 100) / 100;
            stockDataHA.rsi = Math.round(currRSI * 100) / 100;
            // * SET DATA
            quoteArray[quoteArray.length - 1] = stockDataHA;

            // ! END IF
          } else {
            stockDataHA.open = Math.round(listData.open[timeIndex] * 100) / 100;
            stockDataHA.high = Math.round(listData.high[timeIndex] * 100) / 100;
            stockDataHA.low = Math.round(listData.low[timeIndex] * 100) / 100;
            stockDataHA.close =
              Math.round(listData.close[timeIndex] * 100) / 100;
            quoteArray.push(stockDataHA);
          }
          // ! END timeStampArr.forEach
        });
        resolve(quoteArray);
      });
    });
    return returnPromise;
  }

  calculateUpside(stockName): Promise<any> {
    // const stockName = 'ASTRAL'; // TITAN

    const retPromise = new Promise((resolve, reject) => {
      this.calculateHeikenAshi(stockName)
        .then((quoteArray) => {
          console.log(quoteArray);
          quoteArray.forEach((stock: StockData, index) => {
            if (index > 1) {
              const prevStock: StockData = quoteArray[index - 1];
              if (stock.rsi >= 55 && prevStock.rsi < 55) {
                // console.log('UP ', new Date(stock.timeStamp * 1000));
                this.upsideList.push({ stockIndex: index, move: 'up' });
              } else if (stock.rsi <= 55 && prevStock.rsi > 55) {
                // console.log('DOWN ', new Date(stock.timeStamp * 1000));
                this.upsideList.push({ stockIndex: index, move: 'down' });
              }
            }
          });
          if (this.upsideList[this.upsideList.length - 1].move === 'up') {
            const lastIndex = quoteArray.length - 1;
            const lastStock = quoteArray[lastIndex];
            this.upsideList.push({ stockIndex: lastIndex, move: 'down' });
          }
          const tempArr = [];
          console.log(this.upsideList);
          let preMove = 0;
          this.upsideList.forEach((moveValue, moveIndex) => {
            if (moveValue.move === 'up') {
              const newArray = quoteArray.slice(
                moveValue.stockIndex,
                this.upsideList[moveIndex + 1].stockIndex
              );
              newArray.forEach((stock: StockData, preIndex) => {
                if (preIndex !== newArray.length - 1) {
                  const currMove =
                    (stock.close * 100) / newArray[0].close - 100;
                  preMove = Math.max(currMove, preMove);
                }
              });
            } else {
              tempArr.push({ stockIndex: moveValue.stockIndex, move: preMove });
              preMove = 0;
            }
          });
          console.log(tempArr);
        })
        .catch((error) => {
          console.error(error);
        });
    });

    return retPromise;
  }
}
