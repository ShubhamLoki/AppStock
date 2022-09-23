// import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  // static BE_BASE_URL = 'http://localhost:9091';
  static BE_BASE_URL = environment.backEndBaseUrl;
  crosString = 'http://localhost:8081';
  stock = 'IOC';
  baseUrl = 'https://query2.finance.yahoo.com/v8/finance/chart';
  timeInterval = '1h';
  from = '1577836800'; // 1588506036, 1595745690, 1 JAN 2020 - 1577836800
  to;
  constructor(private httpClient: HttpClient) {}

  /**
   * getMethod
   */
  public getMethod(url): Observable<any> {
    return this.httpClient.get(url);
  }

  // ! Need Change -------------------

  public getStockData(stockName, timeInterval?): Observable<any> {
    this.to = Math.floor(Date.now() / 1000);
    if (timeInterval != null) {
      this.timeInterval = timeInterval;
    }
    // console.log(this.timeInterval);
    return this.httpClient.get(
      `${this.baseUrl}/${stockName}.NS?formatted=true&crumb=w9FEupPhpmK&lang=en-IN&region=IN&interval=${this.timeInterval}&period1=${this.from}&period2=${this.to}&events=div%7Csplit&corsDomain=in.finance.yahoo.com`
    );
  }

  public getStockHistoryData(stockName, timeInterval, from): Observable<any> {
    this.to = Math.floor(Date.now() / 1000);
    return this.httpClient.get(
      `${this.baseUrl}/${stockName}.NS?formatted=true&crumb=w9FEupPhpmK&lang=en-IN&region=IN&interval=${timeInterval}&period1=${from}&period2=${this.to}&events=div%7Csplit&corsDomain=in.finance.yahoo.com`
    );
  }

  getInsiderTrading(): Observable<any> {
    const toDayDate = new Date();

    const toDate = toDayDate.getDate();
    const toMnth = toDayDate.getMonth() + 1;
    const toDayStr = toDate < 10 ? `0${toDate}` : toDate;
    const toMnthStr = toMnth < 10 ? `0${toMnth}` : toMnth;

    const todayDateStr = `${toDayStr}-${toMnthStr}-${toDayDate.getFullYear()}`; //27-08-2020

    const fromDate = new Date();
    // fromDate.setDate(toDayDate.getDate() - 1);
    fromDate.setMonth(toDayDate.getMonth() - 3);
    const frDate = fromDate.getDate();
    const fromMnth = fromDate.getMonth() + 1;
    const fromDayStr = frDate < 10 ? `0${frDate}` : frDate;
    const fromMnthStr = fromMnth < 10 ? `0${fromMnth}` : fromMnth;
    const fromDateStr = `${fromDayStr}-${fromMnthStr}-${fromDate.getFullYear()}`;

    console.log(todayDateStr);
    console.log(fromDateStr);

    const backEndUrl =
      ApiService.BE_BASE_URL +
      `/stock/promoter/crop-pit?fromDate=${fromDateStr}&toDate=${todayDateStr}`;
    // `https://www.nseindia.com/api/corporates-pit?index=equities&from_date=${fromDateStr}&to_date=${todayDateStr}`
    return this.httpClient.get(backEndUrl);

    // `https://www.nseindia.com/api/corporates-pit?index=equities&from_date=26-08-2020&to_date=27-08-2020`
  }

  getCorpInfo(stockName): Observable<any> {
    // ALEMBICLTD
    const backEndUrl =
      ApiService.BE_BASE_URL + `/stock/promoter/crop-info?symbol=${stockName}`;
    // `https://www.nseindia.com/api/quote-equity?symbol=${stockName}&section=corp_info`
    return this.httpClient.get(backEndUrl);
  }

  //! NOT IN USE
  public getOptionFeed(): Observable<any> {
    return this.httpClient.get(
      ApiService.BE_BASE_URL + `/optionchain/optionfeed/NIFTY`
    );
  }

  //! NOT IN USE
  public getOptionFeedAll(): Observable<any> {
    return this.httpClient.get(
      ApiService.BE_BASE_URL + `/optionchain/optionfeedall/NIFTY`
    );
  }
}
