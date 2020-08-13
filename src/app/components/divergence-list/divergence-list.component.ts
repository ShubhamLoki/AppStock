import { Component, OnInit } from '@angular/core';
import { StockDivergenceService } from 'src/app/services/stock.divergence.service';
import { Routes, Router } from '@angular/router';

@Component({
  selector: 'app-divergence-list',
  templateUrl: './divergence-list.component.html',
  styleUrls: ['./divergence-list.component.scss'],
})
export class DivergenceListComponent implements OnInit {
  // localMap = new Map();
  dataArray = [];

  constructor(
    private stockDivergenceService: StockDivergenceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.stockDivergenceService
      .calculateAllDivergence()
      .then((divergenceMap: any) => {
        // console.log(divergenceMap);
        // this.localMap = divergenceMap;
        this.dataArray = divergenceMap;
      });

    setInterval(() => {
      console.log('**** Divergence Calculations *****');

      this.stockDivergenceService.calculateAllDivergence();
    }, 1.8e6);
  }

  getList() {
    // console.log(this.stockDivergenceService.divergenceMap);
    this.router.navigate(['wishlist']);
  }
}
