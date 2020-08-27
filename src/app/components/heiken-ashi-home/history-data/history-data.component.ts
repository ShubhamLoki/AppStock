import { StockData } from './../../../services/stock.divergence.service';
import { Component, OnInit, Input } from '@angular/core';
import { HeikenAshiService } from 'src/app/services/heiken-ashi.service';

@Component({
  selector: 'app-history-data',
  templateUrl: './history-data.component.html',
  styleUrls: ['./history-data.component.scss'],
})
export class HistoryDataComponent implements OnInit {
  quoteList: StockData[];
  @Input() stockName: '';
  constructor(private heikenAshiService: HeikenAshiService) {}

  ngOnInit(): void {
    // this.quoteList = this.heikenAshiService.StocksQuoteArrayMap.get(
    //   this.stockName
    // );
    this.quoteList = this.heikenAshiService.calculateUpside(this.stockName);
  }
}
