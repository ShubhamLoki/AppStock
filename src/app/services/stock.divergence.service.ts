import { CommonService } from './common.service';
import { Injectable } from '@angular/core';
import { STOCK_LIST } from '../constants/app.constants';
import { ApiService } from './rest-api/api.service';
import { times } from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class StockDivergenceService {
  stockArray = STOCK_LIST;
  rsiInterval = 14;
  divergenceInterval = 20;
  lastCheckInterval = 20;
  moveCheckInterval = 24;
  hourDivergenceMap = new Map<string, any>();
  dayDivergenceMap = new Map<string, any>();

  constructor(private apiService: ApiService) {}

  // ! Not In Use
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

  // ! Not In Use
  calculateAllDivergenceTest() {
    const resultPromise = new Promise((resolve, reject) => {
      this.stockArray.forEach((stockName, nameIntex) => {
        this.calculateDivergence(stockName, '1h')
          .then((quoteArray) => {
            if (quoteArray.length > this.lastCheckInterval) {
              for (
                let checkIndex = quoteArray.length - this.lastCheckInterval;
                checkIndex < quoteArray.length - 1;
                checkIndex++
              ) {
                const crrStockData: StockData = quoteArray[checkIndex];
                // console.log(crrStockData.lowerStockData);
                if (crrStockData.lowerStockData) {
                  this.hourDivergenceMap.set(stockName, crrStockData);
                }
              }
            }
            if (nameIntex == this.stockArray.length - 1) {
              resolve(this.hourDivergenceMap);
            }
            // ! END calculateDivergence
          })
          .catch((error) => {
            console.error(error);
          });
        // ! END stockArray.forEach
      });
      // ! END apiService.getStockData
    });

    return resultPromise;
  }

  calculateDivergence(stockName, timeInterval): Promise<any> {
    const returnPromise = new Promise((resolve, reject) => {
      this.apiService
        .getStockData(stockName, timeInterval)
        .subscribe((data: any) => {
          if (!data) {
            reject();
          }
          const quoteArray = [];
          // console.log('************ ', stockName);
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
            // CommonService.truncNumber(listData.open[timeIndex]);
            // * SET DATA
            stockData.open = Math.round(listData.open[timeIndex] * 100) / 100;
            stockData.high = Math.round(listData.high[timeIndex] * 100) / 100;
            stockData.low = Math.round(listData.low[timeIndex] * 100) / 100;
            stockData.close = Math.round(listData.close[timeIndex] * 100) / 100;
            stockData.volume =
              Math.round(listData.volume[timeIndex] * 100) / 100;
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
              // console.log(quoteArray.length, currStockData.rsi);
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
                  // console.log(quoteArray[idea]);
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
                      // console.error('Error : ', upside);
                      // console.error(quoteArray[fromIdea]);
                      if (
                        lowerStockData == null ||
                        lowerStockData.low > quoteArray[idea].low
                      ) {
                        lowerStockData = quoteArray[idea];
                        // console.error('***');
                        // console.error(quoteArray[idea]);
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
          resolve(quoteArray);
        });
    });

    return returnPromise;
  }

  calculateUpsideAfterDivergence(quoteArray): void {
    // console.log(quoteArray);

    // Calculate upside in next 20 candales after each divergence
    quoteArray.forEach((stockData: StockData, index) => {
      if (stockData.lowerStockData) {
        let nextIndex = 0;
        if (quoteArray.length < index + this.moveCheckInterval) {
          nextIndex = quoteArray.length;
        } else {
          nextIndex = index + this.moveCheckInterval;
        }
        let preMove = 0;
        const splitArray = quoteArray.slice(index, nextIndex);
        // console.log(index, nextIndex);
        // console.log(splitArray);

        splitArray.forEach((stock: StockData, preIndex) => {
          // console.log(stock.close, splitArray[0].close);
          // console.log(stock.close - splitArray[0].close);
          const currMove = (stock.close * 100) / splitArray[0].close - 100;
          preMove = Math.max(currMove, preMove);
        });
        stockData.preMove = Math.round(preMove * 100) / 100;
      }
    });
  }

  fetchStockParallel(timeInterval): Promise<any> {
    return new Promise((resolve, reject) => {
      const fetched: any[] = [];
      let index = 0;

      const fetchPromise = (stockName) =>
        this.calculateDivergence(stockName, timeInterval);

      const fetchStockFn = () => {
        console.log(index.toString());
        if (index === this.stockArray.length) {
          return;
        }

        const stockName = this.stockArray[index++];

        fetchPromise(stockName).then((quoteArray) => {
          //
          console.log(stockName);
          if (quoteArray.length > this.lastCheckInterval) {
            for (
              let checkIndex = quoteArray.length - this.lastCheckInterval;
              checkIndex < quoteArray.length - 1;
              checkIndex++
            ) {
              const crrStockData: StockData = quoteArray[checkIndex];
              if (crrStockData.lowerStockData) {
                if (timeInterval === '1h') {
                  this.hourDivergenceMap.set(stockName, crrStockData);
                } else {
                  this.dayDivergenceMap.set(stockName, crrStockData);
                }
              }
            }
          }
          //
          fetched.push(quoteArray);
          console.log(fetched.length, this.stockArray.length);
          if (fetched.length === this.stockArray.length) {
            console.log('****************************');
            // this.divergenceMap = fetched;
            resolve('');
          } else {
            fetchStockFn();
          }
        });
      };

      times(50, fetchStockFn);
    });
  }
}

export class StockData {
  stockName;
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
  preMove;
  volumePer;
  dayChangePer;

  constructor() {}
}
