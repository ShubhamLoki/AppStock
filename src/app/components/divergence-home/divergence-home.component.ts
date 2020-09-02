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
  showHourlyDivergence = false;
  showDayDivergence = false;
  showWishList = true;
  timeInterval;

  constructor(
    public stockDivergenceService: StockDivergenceService,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {}

  getList(): void {
    this.showHourlyDivergence = false;
    this.showDayDivergence = false;
    this.showWishList = true;
  }

  openHourDiver(): void {
    this.apiService.timeInterval = '1h';
    this.showHourlyDivergence = true;
    this.showDayDivergence = false;
    this.showWishList = false;
  }

  openDayDiver(): void {
    this.apiService.timeInterval = '1d';
    this.showHourlyDivergence = false;
    this.showDayDivergence = true;
    this.showWishList = false;
  }
}
