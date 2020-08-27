import { STOCK_LIST } from './../constants/app.constants';
import { STOCK_LIST_HEIKIN } from './../constants/stock-list.constants';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { StockData } from './stock.divergence.service';
import { times } from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class HeikenAshiService {
  rsiInterval = 14;
  upsideList = [];
  stockArray = STOCK_LIST; // STOCK_LIST_HEIKIN
  stockLatestDataArray = [];
  StocksQuoteArrayMap = new Map<string, StockData[]>();

  stockQuoteArrayMap = new Map<string, any[]>();
  constructor(private apiService: ApiService) {}

  calculateHeikenAshi(stockName): Promise<any> {
    const returnPromise = new Promise((resolve, reject) => {
      this.apiService.timeInterval = '1d';
      this.apiService.getStockData(stockName).subscribe((data: any) => {
        // console.log(stockName);

        if (!data) {
          reject();
        }

        const quoteArray = [];
        // console.log('************ ', stockName);
        const result = data.chart.result[0];
        const listData: any = result.indicators.quote[0];
        const timeStampArr: any = result.timestamp;
        if (!timeStampArr) {
          reject(stockName);
          return;
        }
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

          stockDataHA.stockName = stockName;
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
        // this.stockQuoteArrayMap.set(stockName, quoteArray);
        resolve(quoteArray);
      });
    });
    return returnPromise;
  }

  calculateUpside(stockName): StockData[] {
    const quoteArray = this.StocksQuoteArrayMap.get(stockName);
    const newMoveArr: StockData[] = [];
    let preMove = 0;

    console.log(quoteArray);
    quoteArray.forEach((stock: StockData, index) => {
      if (index > 1) {
        const prevStock: StockData = quoteArray[index - 1];
        if (stock.rsi >= 55 && prevStock.rsi < 55) {
          this.upsideList.push({
            stockData: stock,
            stockIndex: index,
            move: 'up',
          });
        } else if (stock.rsi <= 55 && prevStock.rsi > 55) {
          this.upsideList.push({
            stockData: stock,
            stockIndex: index,
            move: 'down',
          });
        }
      }
    });
    if (this.upsideList[this.upsideList.length - 1].move === 'up') {
      const lastIndex = quoteArray.length - 1;
      const lastStock = quoteArray[lastIndex];
      this.upsideList.push({
        stockData: lastStock,
        stockIndex: quoteArray.length - 1,
        move: 'down',
      });
    }
    console.log(this.upsideList);
    let stockUp;
    this.upsideList.forEach((moveValue, moveIndex) => {
      if (moveValue.move === 'up') {
        stockUp = moveValue.stockData;
        const newArray = quoteArray.slice(
          moveValue.stockIndex,
          this.upsideList[moveIndex + 1].stockIndex
        );
        newArray.forEach((stock: StockData, preIndex) => {
          if (preIndex !== newArray.length - 1) {
            const currMove = (stock.close * 100) / newArray[0].close - 100;
            preMove = Math.max(currMove, preMove);
          }
        });
      } else {
        if (stockUp) {
          stockUp.preMove = preMove;
          newMoveArr.push(stockUp);
        }
        preMove = 0;
      }
    });
    console.log(newMoveArr);
    return newMoveArr;
  }

  fetchStockParallel() {
    return new Promise((resolve, reject) => {
      const fetched: any[] = [];
      let index = 0;

      const fetchPromise = (stockName) => this.calculateHeikenAshi(stockName);

      const fetchStockFn = () => {
        // console.log(index.toString());
        if (index === this.stockArray.length) {
          return;
        }

        const stockName = this.stockArray[index++];

        fetchPromise(stockName).then((quoteArray) => {
          fetched.push(quoteArray);
          this.StocksQuoteArrayMap.set(stockName, quoteArray);
          if (fetched.length === this.stockArray.length) {
            console.log('****************************');
            resolve(fetched);
          } else {
            fetchStockFn();
          }
        });
      };

      times(50, fetchStockFn);
    });
  }

  getCurrentRSIOfAll(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.fetchStockParallel()
        .then((allFetched: []) => {
          console.log(allFetched);
          const stockRSIArray = [];
          allFetched.forEach((qouteArray: []) => {
            const lastData: StockData = qouteArray[qouteArray.length - 1];
            stockRSIArray.push(lastData);
          });
          this.stockLatestDataArray = stockRSIArray;
          resolve(stockRSIArray);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  }

  getNear55(): any[] {
    const localStockArray: any[] = [];
    this.StocksQuoteArrayMap.forEach((qouteArray: StockData[], stockName) => {
      const lastIdex = qouteArray.length - 1;
      const lastStockData: StockData = qouteArray[lastIdex];
      const secLastStockData: StockData = qouteArray[lastIdex - 1];
      if (
        lastStockData.rsi >= 50 &&
        lastStockData.rsi <= 55 &&
        secLastStockData.rsi <= lastStockData.rsi
      ) {
        localStockArray.push({
          stock: stockName,
          stockObj: lastStockData,
        });
      }
    });

    return localStockArray;
  }
}
