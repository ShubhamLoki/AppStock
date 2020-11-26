import { CommonService } from './../../services/common.service';
import { environment } from './../../../environments/environment';
import { OptionChainService } from './../../services/option-chain.service';
import { ApiService } from '../../services/rest-api/api.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-option-chain-home',
  templateUrl: './option-chain-home.component.html',
  styleUrls: ['./option-chain-home.component.scss'],
})
export class OptionChainHomeComponent implements OnInit {
  strikes = [];
  selectedCE;
  selectedPE;

  symbol = 'NIFTY';
  strikePriceCE = '11600';
  strikePricePE = '11600';
  optionCE = 'CE';
  optionPE = 'PE';
  expDate = '08-10-2020';
  // ----------- Chart Data
  chartCEReady = false;
  chartPEReady = false;
  chartPDReady = false;
  showOptionAnalysis = true;
  showOptionChain = false;
  showOptionDetails = false;
  showOptionPD = false;

  public chartType: string = 'line';
  public chartCEDatasets1: Array<any> = [];
  public chartCEDatasets2: Array<any> = [];
  public chartCEDatasets3: Array<any> = [];
  public chartCEDatasets4: Array<any> = [];
  public chartPEDatasets1: Array<any> = [];
  public chartPEDatasets2: Array<any> = [];
  public chartPEDatasets3: Array<any> = [];
  public chartPEDatasets4: Array<any> = [];
  public chartPCRDatasets: Array<any> = [];
  public chartPDDatasets: Array<any> = [];

  public chartLabels: Array<any> = [];
  public chartColors: Array<any> = [
    {
      backgroundColor: 'rgba(0, 137, 132, .2)',
      borderColor: 'rgba(0, 10, 130, .7)',
      borderWidth: 2,
    },
    {
      backgroundColor: 'rgba(105, 0, 132, .2)',
      borderColor: 'rgba(200, 99, 132, .7)',
      borderWidth: 2,
    },
  ];
  public chartOptions: any = {
    responsive: true,
  };
  // -------------------
  time = new Date();

  constructor(
    private apiService: ApiService,
    private optionChainService: OptionChainService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    // this.loadOptionChainData();
    // this.loadOptionFeed();
    this.symbol = 'NIFTY';
    this.strikePriceCE = '12700';
    this.strikePricePE = '12700';
    this.optionCE = 'CE';
    this.optionPE = 'PE';
    // this.expDate = this.commonService.getExpiryDate();
    this.expDate = environment.expiryDate;
    this.selectedCE = Number(this.strikePriceCE);
    this.selectedPE = Number(this.strikePricePE);

    setInterval(() => {
      this.time = new Date();
    }, 1000);
  }

  private loadStrikePrices(): void {
    this.optionChainService.getStrikePrice(this.symbol).then((data) => {
      // console.log(data);
      data.forEach((strike) => {
        this.strikes.push({
          value: strike.strikePrice,
          viewValue: strike.strikePrice,
        });
      });
    });
  }

  public refresh(): void {
    // this.loadOptionFeed();
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
    // this.loadOptionFeedAll();
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
          // this.chartCEDatasets1.push({
          //   data: arrayObj.premiumDecayArray,
          //   label: 'Premium Decay',
          // });
          this.chartCEDatasets2.push({ data: arrayObj.oipArray, label: 'COI' });
          this.chartCEDatasets1.push({ data: arrayObj.ivArray, label: 'IV' });
          this.chartCEDatasets2.push({
            data: arrayObj.volumeArray,
            label: 'Volume',
          });
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
          // this.chartPEDatasets1.push({
          //   data: arrayObj.premiumDecayArray,
          //   label: 'Premium Decay',
          // });
          this.chartPEDatasets2.push({ data: arrayObj.oipArray, label: 'COI' });
          this.chartPEDatasets1.push({ data: arrayObj.ivArray, label: 'IV' });
          this.chartPEDatasets2.push({
            data: arrayObj.volumeArray,
            label: 'Volume',
          });
          this.chartPEDatasets3.push({
            data: arrayObj.coiVolumeRationArray,
            label: 'COI/VOLUME',
          });
          this.chartPEDatasets4.push({ data: arrayObj.ltpArray, label: 'LTP' });

          this.chartPEReady = true;
        }
      });
  }

  trackByFn(index, stock): string {
    return stock.id;
  }

  public chartClicked(e: any): void {}
  public chartHovered(e: any): void {}

  public dropDownChangedCE(e: any): void {
    console.log(e);
    this.strikePriceCE = e.value;
    this.loadOptionChain(
      this.symbol,
      this.strikePriceCE,
      this.optionCE,
      this.expDate
    );
  }
  public dropDownChangedPE(e: any): void {
    console.log(e);
    this.strikePricePE = e.value;
    this.loadOptionChain(
      this.symbol,
      this.strikePricePE,
      this.optionPE,
      this.expDate
    );
  }

  showOptionChainDiv(): void {
    this.showOptionAnalysis = false;
    this.showOptionChain = true;
    this.showOptionDetails = false;
    this.showOptionPD = false;

    this.refresh();
    this.loadStrikePrices();
    setInterval(() => {
      this.refresh();
    }, 3 * 60 * 1000); // run on every 3 min
  }
  showOptionAnalysisDiv(): void {
    this.showOptionAnalysis = true;
    this.showOptionChain = false;
    this.showOptionDetails = false;
    this.showOptionPD = false;
  }

  showOptionDetailsComp(): void {
    this.showOptionAnalysis = false;
    this.showOptionChain = false;
    this.showOptionDetails = true;
    this.showOptionPD = false;
  }

  showOptionPremiumDecay(): void {
    this.showOptionAnalysis = false;
    this.showOptionChain = false;
    this.showOptionDetails = false;
    this.showOptionPD = true;

    this.optionChainService.getOptionPremium().then((dataObj) => {
      console.log(dataObj);
      this.chartPDDatasets = [];
      // console.log(dataObj.permiumPEMap.values());
      // console.log(dataObj.permiumPEMap.keys());
      this.chartPDDatasets.push({
        data: [...dataObj.permiumPEMap.values()],
        label: 'PE',
      });
      this.chartPDDatasets.push({
        data: [...dataObj.permiumCEMap.values()],
        label: 'CE',
      });
      this.chartLabels = [...dataObj.permiumCEMap.keys()];
      this.chartPDReady = true;
    });
  }
}

// PD = AVG(LTP(Final) - LTP(INIT));
