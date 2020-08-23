import { Router } from '@angular/router';
import { StockDivergenceService } from './../../services/stock.divergence.service';
import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-day-divergence',
  templateUrl: './day-divergence.component.html',
  styleUrls: ['./day-divergence.component.scss'],
})
export class DayDivergenceComponent implements OnInit {
  localMap = new Map();
  status = 'Loading...';

  constructor(
    public stockDivergenceService: StockDivergenceService,
    public apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // this.apiService.timeInterval = '1h';
    // this.stockDivergenceService
    //   .calculateAllDivergenceTest()
    //   .then((divergenceMap: any) => {
    //     this.localMap = divergenceMap;
    //     console.log('Loaded***');
    //   this.status = 'Loaded!';
    //     // this.dataArray = divergenceMap;
    //   });
    // setInterval(() => {
    //   console.log('**** Divergence Calculations *****');
    //   this.stockDivergenceService.calculateAllDivergence();
    // }, 1.8e6);
    console.log(this.apiService.timeInterval);
    this.stockDivergenceService
      .fetchStockParallel(this.apiService.timeInterval)
      .then(() => {
        if (this.apiService.timeInterval === '1h') {
          this.localMap = this.stockDivergenceService.hourDivergenceMap;
        } else {
          this.localMap = this.stockDivergenceService.dayDivergenceMap;
        }
        console.log('Loaded***');
        this.status = 'Loaded!';
      });
  }

  openDivergence(stockName) {
    this.apiService.stock = stockName;
    this.router.navigate(['hourly']);
  }
}
