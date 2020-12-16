import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StockApiService {
  static SUB_PATH = 'stock';

  constructor(private apiService: ApiService) {}

  // "/strike-price/{symbol}"
  /**
   * getStrikePrice
   */
  public getStrikePrice(symbol): Observable<any> {
    const url = `${ApiService.BE_BASE_URL}/${StockApiService.SUB_PATH}/strike-price/${symbol}`;
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
    const url = `${ApiService.BE_BASE_URL}/${StockApiService.SUB_PATH}/option-chain/${symbol}
    ?strikePrice=${strikePrice}&option=${option}&expDate=${expDate}&from=${from}`;
    return this.apiService.getMethod(url);
  }
  // "/option-feed/{symbol}"
  /**
   * getOptionFeed
   */
  public getOptionFeed(symbol): Observable<any> {
    const url = `${ApiService.BE_BASE_URL}/${StockApiService.SUB_PATH}/option-feed/${symbol}`;
    return this.apiService.getMethod(url);
  }

  /**
   *
   * @param stockName : Ex. TCS
   */
  getCorpInfo(stockName): Observable<any> {
    // ALEMBICLTD
    const backEndUrl = `${ApiService.BE_BASE_URL}/${StockApiService.SUB_PATH}/promoter/
    crop-info?symbol=${stockName}`;
    // `https://www.nseindia.com/api/quote-equity?symbol=${stockName}&section=corp_info`
    return this.apiService.getMethod(backEndUrl);
  }

  /**
   * This function call api service get request to get current option details for
   * all strike prices.
   * @returns Observable to subscribe other methods
   */
  public getOptionDetails(symbol): Observable<any> {
    const backEndUrl = `${ApiService.BE_BASE_URL}/${StockApiService.SUB_PATH}/option/details/${symbol}`;
    return this.apiService.getMethod(backEndUrl);
  }

  /**
   * This function call api service get request to get current option Premium Decay
   * all 3 highest strike price call side and put side.
   * @returns Observable to subscribe other methods
   */
  public getOptionPremium(stockName, expDate): Observable<any> {
    console.log(stockName);
    const backEndUrl = `${ApiService.BE_BASE_URL}/${StockApiService.SUB_PATH}/premium/
    ${stockName}?expDate=${expDate}`;
    return this.apiService.getMethod(backEndUrl);
  }
}
