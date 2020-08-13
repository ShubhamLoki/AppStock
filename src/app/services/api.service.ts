import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  crosString = 'http://localhost:8080';
  stock = 'IOC';
  baseUrl = 'https://query2.finance.yahoo.com/v8/finance/chart';
  timeInterval = '1h';
  from = '1588506036'; // 1588506036, 1595745690
  to;
  constructor(private httpClient: HttpClient) {}

  public getData() {
    // const from = '1595745690';
    // const to = '1596264090';
    this.to = Math.floor(Date.now() / 1000);
    console.log('to ', this.to);

    return this.httpClient.get(
      `${this.crosString}/${this.baseUrl}/${this.stock}.NS?formatted=true&crumb=w9FEupPhpmK&lang=en-IN&region=IN&interval=${this.timeInterval}&period1=${this.from}&period2=${this.to}&events=div%7Csplit&corsDomain=in.finance.yahoo.com`
    );
  }

  public getStockData(stockName) {
    // const from = '1595745690';
    // const to = '1596264090';
    this.to = Math.floor(Date.now() / 1000);
    console.log('to ', this.to);
    return this.httpClient.get(
      `${this.crosString}/${this.baseUrl}/${stockName}.NS?formatted=true&crumb=w9FEupPhpmK&lang=en-IN&region=IN&interval=1h&period1=${this.from}&period2=${this.to}&events=div%7Csplit&corsDomain=in.finance.yahoo.com`
    );
  }
}
