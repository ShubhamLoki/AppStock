import { OptionChainService } from './../../services/option-chain.service';
import { ApiService } from './../../services/api.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-option-chain-home',
  templateUrl: './option-chain-home.component.html',
  styleUrls: ['./option-chain-home.component.scss'],
})
export class OptionChainHomeComponent implements OnInit {
  underlyingValue;
  pcRatio;
  lastUpdatedAt;
  stockOIList;
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

  public chartType: string = 'line';
  public chartCEDatasets1: Array<any> = [];
  public chartCEDatasets2: Array<any> = [];
  public chartCEDatasets3: Array<any> = [];
  public chartCEDatasets4: Array<any> = [];
  public chartPEDatasets1: Array<any> = [];
  public chartPEDatasets2: Array<any> = [];
  public chartPEDatasets3: Array<any> = [];
  public chartPEDatasets4: Array<any> = [];
  public chartLabels: Array<any> = [];
  public chartColors: Array<any> = [
    {
      backgroundColor: 'rgba(105, 0, 132, .2)',
      borderColor: 'rgba(200, 99, 132, .7)',
      borderWidth: 2,
    },
    {
      backgroundColor: 'rgba(0, 137, 132, .2)',
      borderColor: 'rgba(0, 10, 130, .7)',
      borderWidth: 2,
    },
  ];
  public chartOptions: any = {
    responsive: true,
  };
  // -------------------

  constructor(
    private apiService: ApiService,
    private optionChainService: OptionChainService
  ) {}

  ngOnInit(): void {
    // this.loadOptionChainData();
    // this.loadOptionFeed();
    this.symbol = 'NIFTY';
    this.strikePriceCE = '11900';
    this.strikePricePE = '11900';
    this.optionCE = 'CE';
    this.optionPE = 'PE';
    this.expDate = '15-10-2020';
    this.selectedCE = Number(this.strikePriceCE);
    this.selectedPE = Number(this.strikePricePE);

    this.loadOptionFeed();
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
    this.optionChainService.getStrikePrice(this.symbol).then((data) => {
      console.log(data);
      data.forEach((strike) => {
        this.strikes.push({
          value: strike.strikePrice,
          viewValue: strike.strikePrice,
        });
      });
    });
    setInterval(() => {
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
      this.loadOptionFeed();
    }, 3 * 60 * 1000); // run on every 3 min
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
          this.chartCEDatasets1.push({
            data: arrayObj.premiumDecayArray,
            label: 'Premium Decay',
          });
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
          this.chartPEDatasets1.push({
            data: arrayObj.premiumDecayArray,
            label: 'Premium Decay',
          });
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

  // ! NOT IN USE
  private loadOptionChainData(): void {
    this.apiService.getLastData().subscribe((response: any) => {
      // const data = response.content;
      const lastDate = response.content[0].creationDateTime.substring(0, 10);
      console.log(lastDate);
      this.apiService.getOptionChainData(lastDate).subscribe((data: any) => {
        // data.sort((a, b) => (a.creationDateTime > b.creationDateTime ? 1 : -1));
        console.log(data);
        const ltpArr = [];
        const preDecyArr = [];
        const volumeArr = [];
        const ivArr = [];
        const oipArr = [];
        const timeArr = [];
        if (data) {
          let premiumDecay = 0;
          data.forEach((option, index) => {
            let changeInPrice = 0;
            if (index > 0) {
              changeInPrice = option.lastPrice - data[index - 1].lastPrice;
              premiumDecay =
                (premiumDecay * (index - 1) + changeInPrice) / index;
              console.log(premiumDecay, index, changeInPrice);
            }
            ltpArr.push(premiumDecay);
            oipArr.push(option.changeinOpenInterest);
            ivArr.push(option.impliedVolatility);
            volumeArr.push(option.totalTradedVolume);
            // Calculate Premium Decay
            const timeStr = option.timestamp.substring(12, 17); // 30-Sep-2020 10:28:11
            timeArr.push(timeStr);
          });
        }
        this.chartLabels = timeArr;
        this.chartCEDatasets1 = [];
        this.chartCEDatasets2 = [];
        this.chartCEDatasets1.push({ data: ltpArr, label: 'Premium Decay' });
        this.chartCEDatasets2.push({ data: oipArr, label: 'COI' });
        this.chartCEDatasets1.push({ data: ivArr, label: 'IV' });
        this.chartCEDatasets2.push({ data: volumeArr, label: 'Volume' });
        this.chartCEReady = true;
      });
    });
  }

  loadOptionFeed(): void {
    this.optionChainService.getOptionFeed().then((data: any) => {
      console.log(data.content[0]);
      const stockOI = data.content[0];
      this.underlyingValue = stockOI.underlyingValue;
      this.pcRatio = stockOI.pcRatio;
      this.lastUpdatedAt = stockOI.creationDateTime;
      this.stockOIList = stockOI.stockOIList;
    });
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
}

// PD = AVG(LTP(Final) - LTP(INIT));

/**
 * askPrice: 262.45
 * askQty: 150
 * bidQty: 75
 * bidprice: 261.55
 * change: 25.899999999999977
 * changeinOpenInterest: 311
 * creationDateTime: "2020-09-30T05:18:13.000+0000"
 * expiryDate: "01-Oct-2020"
 * id: 40783
 * identifier: "OPTIDXNIFTY01-10-2020CE11000.00"
 * impliedVolatility: 0
 * lastPrice: 261.95
 * opIdentifier: "OPTIDXNIFTY01-10-2020CE11000.0030-Sep-2020 10:45:58"
 * openInterest: 7746
 * optionStr: "CE"
 * pChange: 10.972251641601344
 * pchangeInLastPrice: 10.972251641601344
 * pchangeinOpenInterest: 4.182918628110289
 * strikePrice: 11000
 * timestamp: "30-Sep-2020 10:45:58"
 * totalBuyQuantity: 181425
 * totalSellQuantity: 80325
 * totalTradedVolume: 8773
 * underlying: "NIFTY"
 * underlyingValue: 11257.5
 */
