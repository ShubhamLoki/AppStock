import { Component, OnInit } from '@angular/core';
import { STOCK_LIST } from 'src/app/constants/app.constants';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-wish-list',
  templateUrl: './wish-list.component.html',
  styleUrls: ['./wish-list.component.scss'],
})
export class WishListComponent implements OnInit {
  stockArray = STOCK_LIST;
  showStockWishList = true;
  showHourlyDataList = false;
  showDayDataList = false;

  constructor(private router: Router, public apiService: ApiService) {}

  ngOnInit(): void {
    this.stockArray.sort();
    this.showStockWishList = true;
    this.showHourlyDataList = false;
    this.showDayDataList = false;
  }

  public openHourlyDivergence(stockName): void {
    console.log(stockName);
    this.apiService.stock = stockName;
    this.apiService.timeInterval = '1h';

    this.showStockWishList = false;
    this.showHourlyDataList = true;
    this.showDayDataList = false;

    // this.router.navigate(['hourly']);
  }

  public openDayDivergence(stockName): void {
    this.apiService.stock = stockName;
    this.apiService.timeInterval = '1d';

    this.showStockWishList = false;
    this.showHourlyDataList = false;
    this.showDayDataList = true;

    // this.router.navigate(['hourly']);
  }

  public showWishList(): void {
    this.showStockWishList = true;
    this.showHourlyDataList = false;
    this.showDayDataList = false;
  }
}
