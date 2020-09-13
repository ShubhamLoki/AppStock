import {
  PromotersBuyService,
  Promoter,
} from './../../services/promoters-buy.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promoters-buy-home',
  templateUrl: './promoters-buy-home.component.html',
  styleUrls: ['./promoters-buy-home.component.scss'],
})
export class PromotersBuyHomeComponent implements OnInit {
  status = '';
  localStockArray;
  constructor(public promotersBuyService: PromotersBuyService) {}

  ngOnInit(): void {
    this.status = 'Loading...';
    this.promotersBuyService
      .getInsiderTradingData()
      .then((data) => {
        this.localStockArray = [];
        this.promotersBuyService.stockValueMap.forEach(
          (promoterData: Promoter, stockName) => {
            promoterData.stockName = stockName;
            this.localStockArray.push(promoterData);
          }
        );

        this.localStockArray.sort((a, b) =>
          a.lastBuyDateTime < b.lastBuyDateTime ? 1 : -1
        );
        console.log('****** Loaded');
        this.status = 'Loaded!';
      })
      .catch((error) => {
        this.status = 'Error While Loading';
      });
  }
}
