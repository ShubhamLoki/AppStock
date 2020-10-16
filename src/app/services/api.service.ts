import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  static BE_BASE_URL = 'http://localhost:9090';
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

  public getData() {
    this.to = Math.floor(Date.now() / 1000);
    return this.httpClient.get(
      `${this.baseUrl}/${this.stock}.NS?formatted=true&crumb=w9FEupPhpmK&lang=en-IN&region=IN&interval=${this.timeInterval}&period1=${this.from}&period2=${this.to}&events=div%7Csplit&corsDomain=in.finance.yahoo.com`
    );
  }

  public getStockData(stockName, timeInterval?) {
    this.to = Math.floor(Date.now() / 1000);
    if (timeInterval != null) {
      this.timeInterval = timeInterval;
    }
    console.log(this.timeInterval);
    return this.httpClient.get(
      `${this.baseUrl}/${stockName}.NS?formatted=true&crumb=w9FEupPhpmK&lang=en-IN&region=IN&interval=${this.timeInterval}&period1=${this.from}&period2=${this.to}&events=div%7Csplit&corsDomain=in.finance.yahoo.com`
    );
  }

  public getStockHistoryData(stockName, timeInterval, from) {
    this.to = Math.floor(Date.now() / 1000);
    return this.httpClient.get(
      `${this.baseUrl}/${stockName}.NS?formatted=true&crumb=w9FEupPhpmK&lang=en-IN&region=IN&interval=${timeInterval}&period1=${from}&period2=${this.to}&events=div%7Csplit&corsDomain=in.finance.yahoo.com`
    );
  }

  getInsiderTrading() {
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

    return this.httpClient.get(
      `https://www.nseindia.com/api/corporates-pit?index=equities&from_date=${fromDateStr}&to_date=${todayDateStr}`
    );

    // `https://www.nseindia.com/api/corporates-pit?index=equities&from_date=26-08-2020&to_date=27-08-2020`
  }

  getCorpInfo(stockName) {
    // ALEMBICLTD
    return this.httpClient.get(
      `https://www.nseindia.com/api/quote-equity?symbol=${stockName}&section=corp_info`
    );
  }

  public getOptionChainData(lastDate) {
    return this.httpClient.get(
      `http://localhost:9090/optionchain/today/NIFTY?strikePrice=11600&option=CE&from=${lastDate}`
    );
  }

  /**
   * getLastData
   */
  public getLastData() {
    return this.httpClient.get(
      `http://localhost:9090/optionchain/testnow/NIFTY?strikePrice=11600&option=CE`
    );
  }

  public getOptionFeed() {
    // localhost:9090/optionchain/optionfeed/NIFTY
    return this.httpClient.get(
      `http://localhost:9090/optionchain/optionfeed/NIFTY`
    );
  }
}
