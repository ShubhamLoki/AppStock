import { NIFTY } from './../constants/common.constants';
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

  public getOptionChainBoth(symbole, strikePrice): Promise<any> {
    return new Promise((resolve, reject) => {
      // const from = '2020-10-30';
      const ceCOIList = [];
      const peCOIList = [];
      const timeArr = [];
      this.stockApiService
        .getOptionChainDataBoth(symbole, strikePrice)
        .subscribe((data: Option[]) => {
          console.log(data);
          const multiply = symbole === NIFTY ? 50 : 25;
          if (data) {
            data.sort((a, b) =>
              a.creationDateTime > b.creationDateTime ? 1 : -1
            );
            data.forEach((optionObj: Option, index) => {
              if (optionObj.optionStr === 'CE') {
                ceCOIList.push(optionObj.changeinOpenInterest * multiply);
              } else {
                peCOIList.push(optionObj.changeinOpenInterest * multiply);
                const timeStr = optionObj.timestamp.substring(12, 17); // 30-Sep-2020 10:28:11
                timeArr.push(timeStr);
              }
            });
          }

          resolve({
            peArray: peCOIList,
            ceArray: ceCOIList,
            timeArray: timeArr,
          });
        });
    });
  }

  public getOptionChainAll(symbole, strikePrice): Promise<any> {
    return new Promise((resolve, reject) => {
      // const from = '2020-10-30';
      const ceCOIList = [];
      const ceOIList = [];
      const ceLtpArr = [];
      const ceIvArr = [];
      const ceVolumeArr = [];
      const ceCOIVolumeRationArr = [];

      const peCOIList = [];
      const peOIList = [];
      const peLtpArr = [];
      const peIvArr = [];
      const peVolumeArr = [];
      const peCOIVolumeRationArr = [];

      const timeArr = [];
      this.stockApiService
        .getOptionChainDataBoth(symbole, strikePrice)
        .subscribe((data: Option[]) => {
          console.log(data);
          const multiply = symbole === NIFTY ? 50 : 25;
          if (data) {
            data.sort((a, b) =>
              a.creationDateTime > b.creationDateTime ? 1 : -1
            );
            data.forEach((optionObj: Option, index) => {
              if (optionObj.optionStr === 'CE') {
                ceCOIList.push(optionObj.changeinOpenInterest * multiply);
                ceOIList.push(optionObj.openInterest * multiply);
                ceLtpArr.push(optionObj.lastPrice);
                ceIvArr.push(optionObj.impliedVolatility);
                ceVolumeArr.push(optionObj.totalTradedVolume);
                // ceCOIVolumeRationArr.push(
                //   (optionObj.changeinOpenInterest * multiply) /
                //     optionObj.totalTradedVolume
                // );
              } else {
                peCOIList.push(optionObj.changeinOpenInterest * multiply);
                peOIList.push(optionObj.openInterest * multiply);
                peLtpArr.push(optionObj.lastPrice);
                peIvArr.push(optionObj.impliedVolatility);
                peVolumeArr.push(optionObj.totalTradedVolume);
                // peCOIVolumeRationArr.push(
                //   (optionObj.changeinOpenInterest * multiply) /
                //     optionObj.totalTradedVolume
                // );
                const timeStr = optionObj.timestamp.substring(12, 17); // 30-Sep-2020 10:28:11
                timeArr.push(timeStr);
              }
            });
          }

          resolve({
            peArrays: {
              coiList: peCOIList,
              oiList: peOIList,
              ltpArr: peLtpArr,
              ivArr: peIvArr,
              volumeArr: peVolumeArr,
              coiVolumeRationArr: peCOIVolumeRationArr,
            },
            ceArrays: {
              coiList: ceCOIList,
              oiList: ceOIList,
              ltpArr: ceLtpArr,
              ivArr: ceIvArr,
              volumeArr: ceVolumeArr,
              coiVolumeRationArr: ceCOIVolumeRationArr,
            },
            timeArray: timeArr,
          });
        });
    });
  }

  public getOptionChain(symbole, strikePrice, option, expDate): Promise<any> {
    return new Promise((resolve, reject) => {
      // const from = '2020-10-30';
      const from = formatDate(new Date(), 'yyyy-MM-dd', 'en');
      this.stockApiService
        .getOptionChainData(symbole, strikePrice, option, expDate, from)
        .subscribe((data: Option[]) => {
          const volumeArr = [];
          const ivArr = [];
          const oipArr = [];
          const timeArr = [];
          const coiVolumeRationArr = [];
          const ltpArr = [];
          const multiply = symbole === NIFTY ? 50 : 25;
          if (data) {
            data.sort((a, b) =>
              a.creationDateTime > b.creationDateTime ? 1 : -1
            );
            data.forEach((optionObj: Option, index) => {
              ltpArr.push(optionObj.lastPrice);
              oipArr.push(optionObj.changeinOpenInterest * multiply);
              ivArr.push(optionObj.impliedVolatility);
              volumeArr.push(optionObj.totalTradedVolume);
              coiVolumeRationArr.push(
                (optionObj.changeinOpenInterest * multiply) /
                  optionObj.totalTradedVolume
              );
              const timeStr = optionObj.timestamp.substring(12, 17); // 30-Sep-2020 10:28:11
              timeArr.push(timeStr);
            });
          }

          resolve({
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

  public getOptionFeed(symbol): Promise<any> {
    return new Promise((resolve, reject) => {
      this.stockApiService.getOptionFeed(symbol).subscribe((data: Option[]) => {
        if (data) {
          resolve(data);
        } else {
          reject();
        }
      });
    });
  }

  public getOptionFeedAll(symbol): Promise<any> {
    return new Promise((resolve, reject) => {
      this.stockApiService.getOptionFeedAll(symbol).subscribe((data: any) => {
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
  public getOptionPremium(symbol): Promise<any> {
    return new Promise((resolve, reject) => {
      this.stockApiService
        .getOptionPremium(symbol, environment.expiryDate)
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

  public getMaxOptionChainData(symbol): Promise<any> {
    return new Promise((resolve, reject) => {
      this.stockApiService
        .getMaxOptionChainData(symbol)
        .subscribe((data: any[]) => {
          if (data) {
            resolve(data);
          } else {
            reject();
          }
        });
    });
  }
}
