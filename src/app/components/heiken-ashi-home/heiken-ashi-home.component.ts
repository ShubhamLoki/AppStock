import { Component, OnInit } from '@angular/core';
import { HeikenAshiService } from 'src/app/services/heiken-ashi.service';

@Component({
  selector: 'app-heiken-ashi-home',
  templateUrl: './heiken-ashi-home.component.html',
  styleUrls: ['./heiken-ashi-home.component.scss'],
})
export class HeikenAshiHomeComponent implements OnInit {
  stockList = [];
  constructor(private heikenAshiService: HeikenAshiService) {}

  ngOnInit(): void {
    const stockName = 'ASTRAL'; // TITAN
    this.heikenAshiService
      .calculateHeikenAshi(stockName)
      .then((quoteArray) => {
        // console.log(quoteArray);
        this.stockList = quoteArray;
      })
      .catch((error) => {
        console.error(error);
      });

    this.heikenAshiService.calculateUpside(stockName);
  }
}
