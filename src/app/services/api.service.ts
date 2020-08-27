import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  crosString = 'http://localhost:8081';
  stock = 'IOC';
  baseUrl = 'https://query2.finance.yahoo.com/v8/finance/chart';
  timeInterval = '1h';
  from = '1577836800'; // 1588506036, 1595745690, 1 JAN 2020 - 1577836800
  to;
  constructor(private httpClient: HttpClient) {}

  public getData() {
    this.to = Math.floor(Date.now() / 1000);
    return this.httpClient.get(
      `${this.baseUrl}/${this.stock}.NS?formatted=true&crumb=w9FEupPhpmK&lang=en-IN&region=IN&interval=${this.timeInterval}&period1=${this.from}&period2=${this.to}&events=div%7Csplit&corsDomain=in.finance.yahoo.com`
    );
  }

  public getStockData(stockName, timeInterval?) {
    this.to = Math.floor(Date.now() / 1000);
    if (!timeInterval) {
      timeInterval = this.timeInterval;
    }
    return this.httpClient.get(
      `${this.baseUrl}/${stockName}.NS?formatted=true&crumb=w9FEupPhpmK&lang=en-IN&region=IN&interval=${this.timeInterval}&period1=${this.from}&period2=${this.to}&events=div%7Csplit&corsDomain=in.finance.yahoo.com`
    );
  }
}
