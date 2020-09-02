import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-app-home',
  templateUrl: './app-home.component.html',
  styleUrls: ['./app-home.component.scss'],
})
export class AppHomeComponent implements OnInit {
  showDivergence = false;
  showHeikinAshi = false;
  showPromoters = false;

  constructor() {}

  ngOnInit(): void {}

  openDivergenceHome(): void {
    this.showDivergence = true;
    this.showHeikinAshi = false;
    this.showPromoters = false;
  }
  openHeikinAshiHome(): void {
    this.showDivergence = false;
    this.showHeikinAshi = true;
    this.showPromoters = false;
  }

  openPromotersBuyHome(): void {
    this.showDivergence = false;
    this.showHeikinAshi = false;
    this.showPromoters = true;
  }
}
