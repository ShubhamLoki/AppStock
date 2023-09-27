import { ApiService } from 'src/app/services/rest-api/api.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class YahooFinanceApiServiceService {
  // static SUB_PATH = '/stock';\
  timeInterval = '1h';
  from = '1577836800'; // 1 JAN 2020 - 1577836800
  to;

  baseUrl = 'https://query2.finance.yahoo.com/v8/finance/chart';

  constructor(private apiService: ApiService) {}

  // "/strike-price/{symbol}"
  /**
   * getStrikePrice
   */
  public getStockData(symbol): Observable<any> {
    const url = `${this.baseUrl}/${symbol}.NS?formatted=true&crumb=w9FEupPhpmK&lang=en-IN&region=IN&interval=${this.timeInterval}&period1=${this.from}&period2=${this.to}&events=div%7Csplit&corsDomain=in.finance.yahoo.com`;
    return this.apiService.getMethod(url);
  }
}
