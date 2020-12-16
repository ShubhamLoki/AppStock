import { environment } from './../../environments/environment.prod';
import { Option } from './../models/option.model';
import { StockApiService } from './rest-api/stock.api.service';
import { ApiService } from './rest-api/api.service';
import { Injectable } from '@angular/core';
import { formatDate } from '@angular/common';
import { Promoter } from './promoters-buy.service';
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
      // const from = '2020-10-30';
      const from = formatDate(new Date(), 'yyyy-MM-dd', 'en');
      this.stockApiService
        .getOptionChainData(symbole, strikePrice, option, expDate, from)
        .subscribe((data: Option[]) => {
          // console.log(data);
          // const preDecyArr = [];
          const volumeArr = [];
          const ivArr = [];
          const oipArr = [];
          const timeArr = [];
          const coiVolumeRationArr = [];
          const ltpArr = [];
          if (data) {
            // let premiumDecay = 0;
            data.sort((a, b) =>
              a.creationDateTime > b.creationDateTime ? 1 : -1
            );
            data.forEach((optionObj: Option, index) => {
              // let changeInPrice = 0;
              // if (index > 0) {
              // changeInPrice = optionObj.lastPrice - data[index - 1].lastPrice;
              // premiumDecay =
              //   (premiumDecay * (index - 1) + changeInPrice) / index;
              // console.log(premiumDecay, index, changeInPrice);
              // }
              ltpArr.push(optionObj.lastPrice);
              // preDecyArr.push(premiumDecay);
              oipArr.push(optionObj.changeinOpenInterest);
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
            // premiumDecayArray: preDecyArr,
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
      this.apiService.getOptionFeed().subscribe((data: Option[]) => {
        if (data) {
          resolve(data);
        } else {
          reject();
        }
      });
    });
  }

  public getOptionFeedAll(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService.getOptionFeedAll().subscribe((data: any) => {
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

  /**
   * This function call api service to get option details and manipulate the data to display
   */
  public getOptionDetails(symbol): Promise<any> {
    return new Promise((resolve, reject) => {
      this.stockApiService.getOptionDetails(symbol).subscribe((data) => {
        if (data) {
          resolve(data);
        } else {
          reject(data);
        }
      });
    });
  }

  /**
   * This function call api service to get option data for 3 highest strike open interest call side
   * put side
   */
  public getOptionPremium(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.stockApiService
        .getOptionPremium('NIFTY', environment.expiryDate)
        .subscribe((data) => {
          const permiumCEMap = new Map<string, any>();
          const permiumPEMap = new Map<string, any>();
          let cePremium = 0;
          let pePremium = 0;
          if (data) {
            data.todayOptionData.sort((a, b) =>
              a.creationDateTime > b.creationDateTime ? 1 : -1
            );
            data.lastOptionData.forEach((option: Option) => {
              switch (option.optionStr) {
                case 'PE':
                  pePremium += option.lastPrice;
                  break;
                case 'CE':
                  cePremium += option.lastPrice;
                  break;
              }
            });
            data.todayOptionData.forEach((option: Option) => {
              console.log(option.optionStr, option.timestamp, option.lastPrice);
              switch (option.optionStr) {
                case 'PE':
                  this.addPremium(permiumPEMap, option, pePremium);
                  break;
                case 'CE':
                  this.addPremium(permiumCEMap, option, cePremium);
                  break;
              }
            });
            resolve({ permiumCEMap, permiumPEMap });
          } else {
            reject();
          }
        });
    });
  }

  private addPremium(
    permiumMap: Map<string, any>,
    option: Option,
    lastPremium
  ): void {
    // const timestamp = option.timestamp;
    const timestamp = option.timestamp.substring(12, 17);
    if (permiumMap.has(timestamp)) {
      let decay = permiumMap.get(timestamp);
      // console.log(option.timestamp, option.lastPrice);
      decay += option.lastPrice;
      permiumMap.set(timestamp, decay);
    } else {
      // console.log(option.lastPrice);
      permiumMap.set(timestamp, option.lastPrice - lastPremium);
    }
  }
}
