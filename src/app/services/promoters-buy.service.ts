import { Injectable } from '@angular/core';
import { ApiService } from './rest-api/api.service';
import { times } from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class PromotersBuyService {
  insiderTradingDataMap: Map<string, any[]>;
  corpInfoMap: Map<string, any>;
  stockValueMap: Map<string, Promoter>;

  M_P = 'Market Purchase';
  P_G = 'Promoter Group';
  PS = 'Promoters';
  M_S = 'Market Sale';
  constructor(private apiService: ApiService) {}

  getInsiderTradingData(): Promise<any> {
    // https://www.nseindia.com/api/corporates-pit?index=equities&from_date=26-08-2020&to_date=27-08-2020
    return new Promise<any>((resolve, reject) => {
      this.apiService.getInsiderTrading().subscribe((response: any) => {
        if (!response) {
          reject();
        }
        const localArray: [] = response.data;
        const resuArray = [];
        this.stockValueMap = new Map<string, any>();
        this.insiderTradingDataMap = new Map<string, any[]>();
        this.corpInfoMap = new Map<string, any>();

        localArray.forEach((stock: any) => {
          const stockName = stock.symbol;
          const dataArr = this.insiderTradingDataMap.get(stockName);
          if (dataArr) {
            dataArr.push(stock);
            this.insiderTradingDataMap.set(stockName, dataArr);
          } else {
            this.insiderTradingDataMap.set(stockName, [stock]);
          }
          if (
            stock.personCategory === this.P_G ||
            stock.personCategory === this.PS
          ) {
            if (stock.acqMode === this.M_P) {
              let oldValue: Promoter = this.stockValueMap.get(stockName);
              const acqToDt = new Date(stock.acqtoDt);
              if (oldValue) {
                oldValue.allSeqVal += Number(stock.secVal);
                if (oldValue.lastBuyDateTime < acqToDt) {
                  oldValue.lastBuyDateTime = acqToDt;
                }
                this.stockValueMap.set(stockName, oldValue);
              } else {
                oldValue = new Promoter();
                oldValue.allSeqVal = Number(stock.secVal);
                oldValue.lastBuyDateTime = acqToDt;
                this.stockValueMap.set(stockName, oldValue);
              }
            }
          }
        });
        this.getAbove1crStocks();
        this.getPromoterAvgBuyPrice();
        resolve();
        // this.loadCoropInfo(resolve);
      });
    });
  }

  private loadCoropInfo(resolve): void {
    this.getCorpInfoParallel().then(() => {
      this.stockValueMap.forEach((promoter: Promoter, stockName) => {
        this.getPromoterShareholdingDetails(stockName, promoter);
        this.checkSastRegulations(stockName, promoter);
        if (
          promoter.pledgePer <= 0 &&
          promoter.promoterShareholding >= 50 &&
          promoter.noOfShareSale <= 0 &&
          promoter.isMarketSell === false
        ) {
          promoter.buyThis = true;
        }
      });
      console.log(this.stockValueMap);
      console.log(this.insiderTradingDataMap);
      resolve();
    });
  }

  private checkSastRegulations(stockName: string, promoter: Promoter): void {
    const response = this.corpInfoMap.get(stockName);
    const sastRegulations_29 = response.corporate.sastRegulations_29;
    sastRegulations_29.forEach((element: any) => {
      const brodDate = element.timestamp.substring(0, 11);
      const broD = new Date(brodDate);

      const last6MDate = new Date();
      last6MDate.setMonth(last6MDate.getMonth() - 6);
      const noOfShareSale = Number(element.noOfShareSale);
      if (broD > last6MDate && noOfShareSale > 0) {
        promoter.noOfShareSale += noOfShareSale;
      }
    });
  }
  private getPromoterShareholdingDetails(stockName, promoter: Promoter): void {
    const response = this.corpInfoMap.get(stockName);
    const pledgedetails = response.corporate.pledgedetails[0];
    if (pledgedetails) {
      promoter.promoterShareholding = Number(pledgedetails.per1);
      promoter.pledgePer = Number(pledgedetails.per3);
    }
  }

  private getAbove1crStocks(): void {
    this.insiderTradingDataMap.forEach((stockData, stockName) => {
      const secValue: Promoter = this.stockValueMap.get(stockName);
      if (!secValue || secValue.allSeqVal < 10000000) {
        this.insiderTradingDataMap.delete(stockName);
        this.stockValueMap.delete(stockName);
      }
    });
  }

  private getPromoterAvgBuyPrice(): void {
    this.insiderTradingDataMap.forEach((stockDataArr, stockName) => {
      let allSecAcq = 0;
      let allSecVal = 0;
      const oldValue: Promoter = this.stockValueMap.get(stockName);

      stockDataArr.forEach((stockData) => {
        if (
          stockData.personCategory === this.P_G ||
          stockData.personCategory === this.PS
        ) {
          if (stockData.acqMode === this.M_P) {
            // secAcq // secVal
            allSecAcq += Number(stockData.secAcq);
            allSecVal += Number(stockData.secVal);
          } else if (stockData.acqMode === this.M_S) {
            oldValue.isMarketSell = true;
          }
        }
      });

      let stockAvgBuyPrice = allSecVal / allSecAcq;
      stockAvgBuyPrice = Math.round(stockAvgBuyPrice * 100) / 100;
      oldValue.stockAvgBuyPrice = stockAvgBuyPrice;
      this.stockValueMap.set(stockName, oldValue);
    });
  }
  // ! Not In Use
  getCorpInfo(): Promise<any> {
    return new Promise((resolve, reject) => {
      let index = 0;
      this.stockValueMap.forEach((promoter: Promoter, stockName) => {
        this.apiService.getCorpInfo(stockName).subscribe((response: any) => {
          // const resentQuater = response.corporate.shareholdingPatterns.cols[0];
          console.log(stockName);

          const pledgedetails = response.corporate.pledgedetails[0];
          if (pledgedetails.per3 > 0) {
            // console.log(stockName);
            // this.stockValueMap.delete(stockName);
            // return false;
          }

          promoter.promoterShareholding = Number(pledgedetails.per1);

          // Sell fo MF

          const sastRegulations_29 = response.corporate.sastRegulations_29;
          // console.log(sastRegulations_29);
          sastRegulations_29.forEach((element: any) => {
            const brodDate = element.timestamp.substring(0, 11);
            // const last6MDate = new Date(resentQuater);
            const broD = new Date(brodDate);

            const last6MDate = new Date();
            last6MDate.setMonth(last6MDate.getMonth() - 6);

            // console.log(brodDate);
            // console.log(last6MDate);
            if (
              broD > last6MDate &&
              (element.noOfShareSale != null || element.noOfShareSale > 0)
            ) {
              // console.log(broD);
              // this.stockValueMap.delete(stockName);
            }
          });
          console.log(index, this.stockValueMap.size);

          if (index >= this.stockValueMap.size - 1) {
            resolve();
          }
          index++;

          // console.log(response.corporate.shareholdingPatterns.data[0]);
          // console.log(response.corporate.pledgedetails[0]);
        });
      });
    });
  }

  getCorpInfoParallel(): Promise<any> {
    return new Promise((resolve, reject) => {
      const fetched: any[] = [];
      let index = 0;

      const fetchPromise = (stockName) =>
        this.apiService.getCorpInfo(stockName);

      const fetchStockFn = () => {
        if (index === this.stockValueMap.size) {
          return;
        }

        const stockName = Array.from(this.stockValueMap.keys())[index++];
        fetchPromise(stockName).subscribe((response: any) => {
          fetched.push(response);
          this.corpInfoMap.set(stockName, response);
          if (fetched.length === this.stockValueMap.size) {
            console.log('**************All Loaded**************');
            resolve(fetched);
          } else {
            fetchStockFn();
          }
        });
      };

      times(50, fetchStockFn);
    });
  }
}

export class Promoter {
  stockName;
  allSeqVal;
  stockAvgBuyPrice;
  promoterShareholding;
  isMarketSell;
  pledgePer;
  noOfShareSale;
  buyThis;
  lastBuyDateTime;
  constructor() {
    this.isMarketSell = false;
    this.allSeqVal = 0;
    this.stockAvgBuyPrice = 0;
    this.promoterShareholding = 0;
    this.pledgePer = 0;
    this.noOfShareSale = 0;
    this.buyThis = false;
  }
}
