import { CommonService } from './../../../services/common.service';
import { Option } from './../../../models/option.model';
import { environment } from './../../../../environments/environment.prod';
import { OptionChainService } from './../../../services/option-chain.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-option-analysis',
  templateUrl: './option-analysis.component.html',
  styleUrls: ['./option-analysis.component.scss'],
})
export class OptionAnalysisComponent implements OnInit {
  underlyingValue;
  pcRatio;
  lastUpdatedAt;
  stockOIList;
  // public chartType: string = 'line';
  chartPCRReady = false;

  public chartPCRDatasets: Array<any> = [];
  public chartPCTOIDatasets: Array<any> = [];
  public chartLabels: Array<any> = [];
  // public chartColors: Array<any> = [
  //   {
  //     backgroundColor: 'rgba(0, 137, 132, .2)',
  //     borderColor: 'rgba(0, 10, 130, .7)',
  //     borderWidth: 2,
  //   },
  //   {
  //     backgroundColor: 'rgba(105, 0, 132, .2)',
  //     borderColor: 'rgba(200, 99, 132, .7)',
  //     borderWidth: 2,
  //   },
  // ];
  // public chartOptions: any = {
  //   responsive: true,
  // };

  constructor(
    private optionChainService: OptionChainService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.refresh();
    setInterval(() => {
      this.refresh();
    }, 3 * 60 * 1000); // run on every 3 min
  }

  refresh(): void {
    this.loadOptionFeedAll();
    this.loadOptionFeed();
  }

  loadOptionFeed(): void {
    this.optionChainService.getOptionFeed().then((data: any) => {
      // console.log(data.content[0]);
      const stockOI = data.content[0];
      this.underlyingValue = stockOI.underlyingValue;
      this.pcRatio = stockOI.pcRatio;
      this.lastUpdatedAt = stockOI.creationDateTime;
      this.stockOIList = stockOI.stockOIList;
      // this.loadPremiumDecay();
    });
  }
  loadPremiumDecay(): void {
    const symbol = 'NIFTY';
    const expDate = environment.expiryDate;
    // const expDate = this.commonService.getExpiryDate();
    this.stockOIList.forEach((stock) => {
      if (stock.type !== 'MAXPP') {
        this.optionChainService
          .getOptionChain(symbol, stock.strikePrice, stock.type, expDate)
          .then((arrayObj) => {
            console.log(arrayObj);
          });
      }
    });
  }

  trackByFn(index, stock): string {
    return stock.id;
  }

  private loadOptionFeedAll(): void {
    this.optionChainService.getOptionFeedAll().then((data: any) => {
      // console.log(data);
      const pcrArray = [];
      const pcrVolArray = [];
      const totOIPEArray = [];
      const totOICEArray = [];
      const timeArr = [];
      this.chartPCRDatasets = [];
      this.chartPCTOIDatasets = [];
      data.forEach((strike) => {
        pcrArray.push(strike.pcRatio);
        pcrVolArray.push(strike.pcVolRatio);
        totOICEArray.push(strike.totOICE);
        totOIPEArray.push(strike.totOIPE);

        const myDate = new Date(strike.creationDateTime);
        const timeStr = myDate.toLocaleString().substring(11, 17); // 30-Sep-2020 10:28:11
        timeArr.push(timeStr);
      });
      // console.log(pcrArray);

      this.chartPCRDatasets.push({ data: pcrArray, label: 'PCR' });
      // this.chartPCRDatasets.push({ data: pcrVolArray, label: 'PCR Vol' });

      this.chartPCTOIDatasets.push({ data: totOIPEArray, label: 'TOI PE' });
      this.chartPCTOIDatasets.push({ data: totOICEArray, label: 'TOI CE' });

      this.chartLabels = timeArr;
      this.chartPCRReady = true;
    });
  }

  // public chartClicked(e: any): void {}
  // public chartHovered(e: any): void {}
}
