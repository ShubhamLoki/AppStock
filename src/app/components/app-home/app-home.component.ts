import { ApiService } from 'src/app/services/api.service';
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
  showOptionChain = false;
  localArray = [1, 2, 3];

  constructor() {}

  ngOnInit(): void {
    // const array = [1, 2, 3, 4, 5];
    // let arr2 = array;
    // arr2 = [5, 5];
    // console.log(array);
    // console.log(arr2);

    this.calculateProduct();
    this.calculateProductIfi();
  }

  openDivergenceHome(): void {
    this.showDivergence = true;
    this.showHeikinAshi = false;
    this.showPromoters = false;
    this.showOptionChain = false;
  }
  openHeikinAshiHome(): void {
    this.showDivergence = false;
    this.showHeikinAshi = true;
    this.showPromoters = false;
    this.showOptionChain = false;
  }

  openPromotersBuyHome(): void {
    this.showDivergence = false;
    this.showHeikinAshi = false;
    this.showPromoters = true;
    this.showOptionChain = false;
  }
  openOptionChainHome(): void {
    this.showDivergence = false;
    this.showHeikinAshi = false;
    this.showPromoters = false;
    this.showOptionChain = true;
  }

  calculateProduct(): number[] {
    console.time('Execution Time');
    const array = this.localArray;
    const productArray = [];
    array.forEach((element, index) => {
      let productValue = 1;
      array.forEach((inneEle, innerIndex) => {
        if (index !== innerIndex) {
          productValue = inneEle * productValue;
        }
      });
      productArray.push(productValue);
    });

    console.log(productArray);
    console.timeEnd('Execution Time');
    return productArray;
  }

  calculateProductIfi(): number[] {
    console.time('Execution Time.');
    const array = this.localArray;
    const productArray = [];
    array.forEach((element, index, arr) => {
      const newArr = [...array];
      newArr.splice(index, 1);
      const retu = newArr.reduce((productValue, value) => productValue * value);
      // console.log(array);
      productArray.push(retu);
    });
    console.log(productArray);
    console.timeEnd('Execution Time.');
    return productArray;
  }
}
