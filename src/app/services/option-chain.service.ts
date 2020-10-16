import { StockApiService } from './stock.api.service';
import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class OptionChainService {
  constructor(
    private apiService: ApiService,
    private stockApiService: StockApiService
  ) {}

  public getOptionChain(symbole, strikePrice, option, expDate): Promise<any> {
    return new Promise((resolve, reject) => {
      const from = '2020-10-15';
      this.stockApiService
        .getOptionChainData(symbole, strikePrice, option, expDate, from)
        .subscribe((data) => {
          console.log(data);
          const preDecyArr = [];
          const volumeArr = [];
          const ivArr = [];
          const oipArr = [];
          const timeArr = [];
          const coiVolumeRationArr = [];
          const ltpArr = [];
          if (data) {
            let premiumDecay = 0;
            data.forEach((optionObj, index) => {
              let changeInPrice = 0;
              if (index > 0) {
                changeInPrice = optionObj.lastPrice - data[index - 1].lastPrice;
                premiumDecay =
                  (premiumDecay * (index - 1) + changeInPrice) / index;
                // console.log(premiumDecay, index, changeInPrice);
              }
              ltpArr.push(optionObj.lastPrice);
              preDecyArr.push(premiumDecay);
              oipArr.push(optionObj.changeinOpenInterest * 75);
              ivArr.push(optionObj.impliedVolatility);
              volumeArr.push(optionObj.totalTradedVolume);
              coiVolumeRationArr.push(
                (optionObj.changeinOpenInterest * 75) /
                  optionObj.totalTradedVolume
              );
              // Calculate Premium Decay
              const timeStr = optionObj.timestamp.substring(12, 17); // 30-Sep-2020 10:28:11
              timeArr.push(timeStr);
            });
          }

          resolve({
            premiumDecayArray: preDecyArr,
            volumeArray: volumeArr,
            ivArray: ivArr,
            oipArray: oipArr,
            timeArray: timeArr,
            coiVolumeRationArray: coiVolumeRationArr,
            ltpArray: ltpArr,
          });
        });
    });
  }

  public getOptionFeed(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService.getOptionFeed().subscribe((data: any) => {
        if (data) {
          resolve(data);
        } else {
          reject();
        }
      });
    });
  }

  public getStrikePrice(symbol): Promise<any> {
    return new Promise((resolve, reject) => {
      this.stockApiService.getStrikePrice(symbol).subscribe((data: any) => {
        if (data) {
          resolve(data);
        } else {
          reject();
        }
      });
    });
  }
}
