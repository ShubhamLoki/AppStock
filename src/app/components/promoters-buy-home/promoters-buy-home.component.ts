import { PromotersBuyService } from './../../services/promoters-buy.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promoters-buy-home',
  templateUrl: './promoters-buy-home.component.html',
  styleUrls: ['./promoters-buy-home.component.scss'],
})
export class PromotersBuyHomeComponent implements OnInit {
  status = '';
  constructor(public promotersBuyService: PromotersBuyService) {}

  ngOnInit(): void {
    this.status = 'Loading...';
    this.promotersBuyService
      .getInsiderTradingData()
      .then((data) => {
        console.log('****** Loaded');
        this.status = 'Loaded!';
      })
      .catch((error) => {
        this.status = 'Error While Loading';
      });
  }
}
