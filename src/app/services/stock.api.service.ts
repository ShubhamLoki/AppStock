import { ApiService } from 'src/app/services/api.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StockApiService {
  static SUB_PATH = '/stock';

  constructor(private apiService: ApiService) {}

  // "/strike-price/{symbol}"
  /**
   * getStrikePrice
   */
  public getStrikePrice(symbol): Observable<any> {
    const url = `${ApiService.BE_BASE_URL}${StockApiService.SUB_PATH}/strike-price/${symbol}`;
    return this.apiService.getMethod(url);
  }

  // "/option-chain/{symbol}"
  /**
   * getOptionChainData
   */
  public getOptionChainData(
    symbol,
    strikePrice,
    option,
    expDate,
    from?
  ): Observable<any> {
    const url = `${ApiService.BE_BASE_URL}${StockApiService.SUB_PATH}/option-chain/${symbol}
    ?strikePrice=${strikePrice}&option=${option}&expDate=${expDate}&from=${from}`;
    return this.apiService.getMethod(url);
  }
  // "/option-feed/{symbol}"
  /**
   * getOptionFeed
   */
  public getOptionFeed(symbol): Observable<any> {
    const url = `${ApiService.BE_BASE_URL}${StockApiService.SUB_PATH}/option-feed/${symbol}`;
    return this.apiService.getMethod(url);
  }
}
