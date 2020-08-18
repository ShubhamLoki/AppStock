import { Component, OnInit } from '@angular/core';
import { StockDivergenceService } from 'src/app/services/stock.divergence.service';
import { Routes, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-divergence-list',
  templateUrl: './divergence-list.component.html',
  styleUrls: ['./divergence-list.component.scss'],
})
export class DivergenceListComponent implements OnInit {
  localMap = new Map();
  // dataArray = [];

  constructor(
    private stockDivergenceService: StockDivergenceService,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.apiService.timeInterval = '1h';
    this.stockDivergenceService
      .calculateAllDivergenceTest()
      .then((divergenceMap: any) => {
        this.localMap = divergenceMap;
        console.log('Loaded***');
        // this.dataArray = divergenceMap;
      });

    setInterval(() => {
      console.log('**** Divergence Calculations *****');
      this.stockDivergenceService.calculateAllDivergence();
    }, 1.8e6);
  }

  getList() {
    this.router.navigate(['wishlist']);
  }

  openDivergence(stockName) {
    this.apiService.stock = stockName;
    this.apiService.timeInterval = '1h';
    this.router.navigate(['hourly']);
  }
}
