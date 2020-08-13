import { Injectable } from '@angular/core';
import { STOCK_LIST } from '../constants/app.constants';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class StockDivergenceService {
  stockArray = STOCK_LIST;
  rsiInterval = 14;
  divergenceInterval = 20;
  lastCheckInterval = 20;
  divergenceMap = new Map<string, any>();

  constructor(private apiService: ApiService) {}

  calculateAllDivergence() {
    console.log('*** calculateAllDivergence');
    const resultPromise = new Promise((resolve, reject) => {
      const stockName = 'ULTRACEMCO';
      // this.stockArray.forEach((stockName, nameIntex) => {
      this.apiService.getStockData(stockName).subscribe((data: any) => {
        const quoteArray = [];
        console.log('************ ', stockName);
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
            move = Math.round(move * 10000) / 10000;
            if (move > 0) {
              upMove = move;
            } else {
              downMove = Math.abs(move);
            }
          }
          // * SET DATA
          stockData.open = Math.round(listData.open[timeIndex] * 100) / 100;
          stockData.high = Math.round(listData.high[timeIndex] * 100) / 100;
          stockData.low = Math.round(listData.low[timeIndex] * 100) / 100;
          stockData.close = Math.round(listData.close[timeIndex] * 100) / 100;
          stockData.volume = Math.round(listData.volume[timeIndex] * 100) / 100;
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
          stockData.avgUpMove = Math.round(avgUpMove * 10000) / 10000;
          stockData.avgDownMove = Math.round(avgDownMove * 10000) / 10000;
          stockData.rs = Math.round(currRS * 100) / 100;
          stockData.rsi = Math.round(currRSI * 100) / 100;
          // * SET DATA
          let lowerStockData: StockData = null;
          const currStockData: StockData = stockData;
          // * Calculate Divergence
          if (quoteArray.length > 15 && currStockData.rsi <= 40) {
            console.log(quoteArray.length, currStockData.rsi);
            for (
              let idea = quoteArray.length - 3;
              idea >= quoteArray.length - 15;
              idea--
            ) {
              // * Check upside gain min 2% between quoteArray[idea] and currStockData
              // * currStockData.low < quoteArray[idea].low and currStockData.rsi > quoteArray[idea].rsi
              if (
                currStockData.low < quoteArray[idea].low &&
                currStockData.rsi > quoteArray[idea].rsi
              ) {
                console.log(quoteArray[idea]);
                for (
                  let fromIdea = idea + 1;
                  fromIdea < quoteArray.length - 1;
                  fromIdea++
                ) {
                  // * check close
                  const upside =
                    (quoteArray[fromIdea].close * 100) /
                      quoteArray[idea].close -
                    100;
                  if (upside >= 2) {
                    console.error('Error : ', upside);
                    console.error(quoteArray[fromIdea]);
                    if (
                      lowerStockData == null ||
                      lowerStockData.low > quoteArray[idea].low
                    ) {
                      lowerStockData = quoteArray[idea];
                      console.error('***');
                      console.error(quoteArray[idea]);
                    }
                  }
                }
              }
            }
          }

          stockData.lowerStockData = lowerStockData;

          quoteArray[quoteArray.length - 1] = stockData;
          // ! END timeStampArr.forEach
        });

        // if (quoteArray.length > this.lastCheckInterval) {
        //   for (
        //     let checkIndex = quoteArray.length - this.lastCheckInterval;
        //     checkIndex < quoteArray.length - 1;
        //     checkIndex++
        //   ) {
        //     console.log(quoteArray[checkIndex].divergence);
        //     if (quoteArray[checkIndex].divergence == true) {
        //       this.divergenceMap.set(stockName, {
        //         timeStamp: quoteArray[checkIndex].timeStamp,
        //         timeComp: quoteArray[checkIndex].timeComp,
        //       });
        //     }
        //   }
        // }
        // if (nameIntex == this.stockArray.length - 1) {
        // resolve(this.divergenceMap);
        // }
        resolve(quoteArray);
      });
      // });
      // ! END apiService.getStockData
    });

    return resultPromise;
  }
}

export class StockData {
  timeStamp;
  open;
  high;
  low;
  close;
  volume;
  upMove;
  downMove;
  avgUpMove;
  avgDownMove;
  rs;
  rsi;
  divergence;
  lowerStockData;

  constructor() {}
}
