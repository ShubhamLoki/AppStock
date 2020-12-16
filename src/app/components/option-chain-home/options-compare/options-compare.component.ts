import { environment } from './../../../../environments/environment.prod';
import { OptionChainService } from './../../../services/option-chain.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-options-compare',
  templateUrl: './options-compare.component.html',
  styleUrls: ['./options-compare.component.scss'],
})
export class OptionsCompareComponent implements OnInit {
  strikes = [];
  selectedCE;
  selectedPE;

  chartCEReady = false;
  chartPEReady = false;
  lastUpdatedAt;
  symbol = 'NIFTY';
  strikePriceCE = '13100';
  strikePricePE = '13100';
  optionCE = 'CE';
  optionPE = 'PE';
  expDate = '08-10-2020';
  status = 'Loading...';

  public chartCEDatasets1: Array<any> = [];
  public chartCEDatasets2: Array<any> = [];
  public chartCEDatasets3: Array<any> = [];
  public chartCEDatasets4: Array<any> = [];
  public chartPEDatasets1: Array<any> = [];
  public chartPEDatasets2: Array<any> = [];
  public chartPEDatasets3: Array<any> = [];
  public chartPEDatasets4: Array<any> = [];
  public chartLabels: Array<any> = [];

  constructor(private optionChainService: OptionChainService) {}

  ngOnInit(): void {
    console.log('=======================');

    this.expDate = environment.expiryDate;
    this.loadStrikePrices();
    this.loadOptionFeed();
    setInterval(() => {
      this.refresh();
    }, 3 * 60 * 1000);
  }
  private loadOptionChain(
    symbol: string,
    strikePrice: string,
    option: string,
    expDate: string
  ): void {
    this.optionChainService
      .getOptionChain(symbol, strikePrice, option, expDate)
      .then((arrayObj) => {
        this.chartLabels = arrayObj.timeArray;
        if (option == 'CE') {
          this.chartCEDatasets1 = [];
          this.chartCEDatasets2 = [];
          this.chartCEDatasets3 = [];
          this.chartCEDatasets4 = [];
          this.chartCEDatasets2.push({ data: arrayObj.oipArray, label: 'COI' });
          this.chartCEDatasets1.push({ data: arrayObj.ivArray, label: 'IV' });
          // this.chartCEDatasets2.push({
          //   data: arrayObj.volumeArray,
          //   label: 'Volume',
          // });
          this.chartCEDatasets3.push({
            data: arrayObj.coiVolumeRationArray,
            label: 'COI/VOLUME',
          });
          this.chartCEDatasets4.push({ data: arrayObj.ltpArray, label: 'LTP' });
          this.chartCEReady = true;
        } else {
          this.chartPEDatasets1 = [];
          this.chartPEDatasets2 = [];
          this.chartPEDatasets3 = [];
          this.chartPEDatasets4 = [];
          this.chartPEDatasets2.push({ data: arrayObj.oipArray, label: 'COI' });
          this.chartPEDatasets1.push({ data: arrayObj.ivArray, label: 'IV' });
          // this.chartPEDatasets2.push({
          //   data: arrayObj.volumeArray,
          //   label: 'Volume',
          // });
          this.chartPEDatasets3.push({
            data: arrayObj.coiVolumeRationArray,
            label: 'COI/VOLUME',
          });
          this.chartPEDatasets4.push({ data: arrayObj.ltpArray, label: 'LTP' });

          this.chartPEReady = true;
        }
        this.status = 'Loaded!';
      });
  }

  public refresh(): void {
    this.status = 'Loading...';
    this.loadOptionChain(
      this.symbol,
      this.strikePriceCE,
      this.optionCE,
      this.expDate
    );
    this.loadOptionChain(
      this.symbol,
      this.strikePricePE,
      this.optionPE,
      this.expDate
    );
    this.lastUpdatedAt = new Date();
  }

  private loadStrikePrices(): void {
    this.optionChainService.getStrikePrice(this.symbol).then((data) => {
      data.forEach((strike) => {
        this.strikes.push({
          value: strike.strikePrice,
          viewValue: strike.strikePrice,
        });
      });
    });
  }

  public dropDownChangedCE(e: any): void {
    this.strikePriceCE = e.value;
    this.loadOptionChain(
      this.symbol,
      this.strikePriceCE,
      this.optionCE,
      this.expDate
    );
  }
  public dropDownChangedPE(e: any): void {
    this.strikePricePE = e.value;
    this.loadOptionChain(
      this.symbol,
      this.strikePricePE,
      this.optionPE,
      this.expDate
    );
  }

  loadOptionFeed(): void {
    this.optionChainService.getOptionFeed().then((data: any) => {
      const stockOI = data.content[0];
      this.lastUpdatedAt = stockOI.creationDateTime;
      const stock = stockOI.stockOIList[stockOI.stockOIList.length - 1]; // Get MAXPP Strike Price to load init
      this.strikePricePE = stock.strikePrice;
      this.strikePriceCE = stock.strikePrice;
      this.selectedCE = Number(this.strikePriceCE);
      this.selectedPE = Number(this.strikePricePE);
      this.refresh();
    });
  }
}
