import { OptionChainService } from './../../../../services/option-chain.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-options-coi-graph',
  templateUrl: './options-coi-graph.component.html',
  styleUrls: ['./options-coi-graph.component.scss'],
})
export class OptionsCoiGraphComponent implements OnInit {
  @Input() strikePrice;
  @Input() symbol;
  @Input() optionObj;

  public chartDatasets: Array<any> = [];
  public chartLabels: Array<any> = [];
  chartReady = false;
  status = 'Loading...';
  constructor(private optionChainService: OptionChainService) {}

  ngOnInit(): void {
    this.loadOptionChainNew(this.symbol, this.strikePrice);
    // this.loadOptionChain(this.symbol, this.strikePrice, 'PE');
    // this.loadOptionChain(this.symbol, this.strikePrice, 'CE');
  }

  private loadOptionChain(
    symbol: string,
    strikePrice: string,
    option: string
  ): void {
    this.optionChainService
      .getOptionChain(symbol, strikePrice, option, null)
      .then((arrayObj) => {
        this.chartLabels = arrayObj.timeArray;
        this.chartDatasets.push({
          data: arrayObj.oipArray,
          label: option + ' COI',
        });
        this.chartReady = true;
        // this.status = 'Loaded!';
      });
  }

  private loadOptionChainNew(symbol: string, strikePrice: string): void {
    this.optionChainService
      .getOptionChainBoth(symbol, strikePrice)
      .then((arrayObj) => {
        this.chartLabels = arrayObj.timeArray;
        this.chartDatasets.push({
          data: arrayObj.peArray,
          label: 'PE COI',
        });
        this.chartDatasets.push({
          data: arrayObj.ceArray,
          label: 'CE COI',
        });
        this.chartReady = true;
        this.status = 'Loaded!';
      });
  }
}
