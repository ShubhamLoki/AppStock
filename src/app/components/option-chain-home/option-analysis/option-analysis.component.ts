import { OptionFeed } from './../../../models/option-feed.model';
import { CommonService } from './../../../services/common.service';
import { Option } from './../../../models/option.model';
import { environment } from './../../../../environments/environment.prod';
import { OptionChainService } from './../../../services/option-chain.service';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-option-analysis',
  templateUrl: './option-analysis.component.html',
  styleUrls: ['./option-analysis.component.scss'],
})
export class OptionAnalysisComponent implements OnInit, OnDestroy {
  @Input() symbol;

  underlyingValue;
  pcRatio;
  lastUpdatedAt;
  autoRefreshTime;
  stockOIList;
  chartPCRReady = false;

  public chartPCRDatasets: Array<any> = [];
  public chartPCTOIDatasets: Array<any> = [];
  public chartPCTCOIDatasets: Array<any> = [];
  public chartCORDatasets: Array<any> = [];
  public chartLabels: Array<any> = [];
  timeInterval;

  constructor(private optionChainService: OptionChainService) {}

  ngOnInit(): void {
    this.autoRefreshTime = new Date();
    this.refresh();
    this.timeInterval = setInterval(() => {
      this.autoRefreshTime = new Date();
      this.refresh();
    }, 3 * 60 * 1000); // run on every 3 min
  }

  ngOnDestroy() {
    clearInterval(this.timeInterval);
  }

  refresh(): void {
    this.loadOptionFeedAll();
    this.loadOptionFeed();
  }

  loadOptionFeed(): void {
    this.optionChainService.getOptionFeed(this.symbol).then((data: any) => {
      // console.log(data.content[0]);
      const stockOI = data.content[0];
      this.underlyingValue = stockOI.underlyingValue;
      this.pcRatio = stockOI.pcRatio;
      this.lastUpdatedAt = stockOI.creationDateTime;
      this.stockOIList = stockOI.stockOIList;
    });
  }

  trackByFn(index, stock): string {
    return stock.id;
  }

  private loadOptionFeedAll(): void {
    this.optionChainService.getOptionFeedAll(this.symbol).then((data: any) => {
      const pcrArray = [];
      const pcrVolArray = [];
      const corArray = [];
      const totOIPEArray = [];
      const totOICEArray = [];
      const totCOIPEArray = [];
      const totCOICEArray = [];
      const timeArr = [];
      this.chartPCRDatasets = [];
      this.chartPCTOIDatasets = [];
      this.chartCORDatasets = [];
      this.chartPCTCOIDatasets = [];
      data.forEach((strike: OptionFeed) => {
        pcrArray.push(strike.pcRatio);
        pcrVolArray.push(strike.pcVolRatio);
        totOICEArray.push(strike.totOICE);
        totOIPEArray.push(strike.totOIPE);
        corArray.push(strike.pcCOIRatio);
        totCOIPEArray.push(strike.totCOIPE);
        totCOICEArray.push(strike.totCOICE);

        const myDate = new Date(strike.creationDateTime);
        const timeStr = myDate.toLocaleString().substring(10, 17); // 30-Sep-2020 10:28:11
        timeArr.push(timeStr);
      });

      this.chartPCRDatasets.push({ data: pcrArray, label: 'TOI PC Ration' });
      // this.chartPCRDatasets.push({ data: pcrVolArray, label: 'PCR Vol' });

      this.chartPCTOIDatasets.push({ data: totOIPEArray, label: 'TOI PE' });
      this.chartPCTOIDatasets.push({ data: totOICEArray, label: 'TOI CE' });

      this.chartCORDatasets.push({ data: corArray, label: 'COI PC Diff' });

      this.chartPCTCOIDatasets.push({ data: totCOIPEArray, label: 'TCOI PE' });
      this.chartPCTCOIDatasets.push({ data: totCOICEArray, label: 'TCOI CE' });

      this.chartLabels = timeArr;
      this.chartPCRReady = true;
    });
  }

  reset() {
    this.autoRefreshTime = new Date();
    clearInterval(this.timeInterval);
    this.refresh();
    this.timeInterval = setInterval(() => {
      this.autoRefreshTime = new Date();
      this.refresh();
    }, 3 * 60 * 1000);
  }
}
