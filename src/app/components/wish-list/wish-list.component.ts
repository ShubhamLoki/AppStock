import { Component, OnInit } from '@angular/core';
import { STOCK_LIST } from 'src/app/constants/app.constants';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-wish-list',
  templateUrl: './wish-list.component.html',
  styleUrls: ['./wish-list.component.scss']
})
export class WishListComponent implements OnInit {

  stockArray = STOCK_LIST;


  constructor(private router: Router, private apiService: ApiService) { }

  ngOnInit(): void {
  }

  public openHourlyDivergence(stockName) {
    console.log(stockName);
    this.apiService.stock = stockName;
    this.apiService.timeInterval = '1h';
    this.router.navigate(['hourly']);
  }

  public openDayDivergence(stockName) {
    this.apiService.stock = stockName;
    this.apiService.timeInterval = '1d';
    // this.apiService.from = '1588506036';
    this.router.navigate(['hourly']);
  }
}
