import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-app-home',
  templateUrl: './app-home.component.html',
  styleUrls: ['./app-home.component.scss'],
})
export class AppHomeComponent implements OnInit {
  showDivergence = false;
  showHeikinAshi = false;
  active = 1;
  divergenceActiveClass;
  heikinAshiActiveClass;

  constructor() {}

  ngOnInit(): void {}

  openDivergenceHome() {
    this.showDivergence = true;
    this.showHeikinAshi = false;
    this.divergenceActiveClass = 'active';
    this.heikinAshiActiveClass = '';
  }
  openHeikinAshiHome() {
    this.showDivergence = false;
    this.showHeikinAshi = true;
    this.divergenceActiveClass = '';
    this.heikinAshiActiveClass = 'active';
  }

  navChangeEv() {
    this.active = 2;
  }
}
