import { Component, OnInit } from '@angular/core';
import { StockDivergenceService } from 'src/app/services/stock.divergence.service';
import { Routes, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-divergence-home',
  templateUrl: './divergence-home.component.html',
  styleUrls: ['./divergence-home.component.scss'],
})
export class DivergenceHomeComponent implements OnInit {
  localMap = new Map();
  // dataArray = [];
  showHourlyDivergence = false;
  showDayDivergence = false;
  showWishList = false;
  timeInterval;

  constructor(
    public stockDivergenceService: StockDivergenceService,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    // this.apiService.timeInterval = '1d';
    // this.stockDivergenceService
    //   .calculateAllDivergenceTest()
    //   .then((divergenceMap: any) => {
    //     this.localMap = divergenceMap;
    //     console.log('Loaded***');
    //     // this.dataArray = divergenceMap;
    //   });
    // setInterval(() => {
    //   console.log('**** Divergence Calculations *****');
    //   this.stockDivergenceService.calculateAllDivergence();
    // }, 1.8e6);
    // this.stockDivergenceService
    //   .fetchStockParallel('1h')
    //   .then((divergenceMap: any) => {
    //     // this.localMap = divergenceMap;
    //     console.log('Loaded***');
    //   });
    // this.stockDivergenceService
    //   .fetchStockParallel('1d')
    //   .then((divergenceMap: any) => {
    //     // this.localMap = divergenceMap;
    //     console.log('Loaded***');
    //   });
  }

  getList() {
    // this.router.navigate(['wishlist']);
    this.showHourlyDivergence = false;
    this.showDayDivergence = false;
    this.showWishList = true;
  }

  // openDivergence(stockName) {
  //   this.apiService.stock = stockName;
  //   this.apiService.timeInterval = '1h';
  //   this.router.navigate(['hourly']);
  // }

  openHourDiver() {
    this.apiService.timeInterval = '1h';
    this.showHourlyDivergence = true;
    this.showDayDivergence = false;
    this.showWishList = false;
  }

  openDayDiver() {
    this.apiService.timeInterval = '1d';
    // this.timeInterval = '1d';
    this.showHourlyDivergence = false;
    this.showDayDivergence = true;
    this.showWishList = false;
  }
}
