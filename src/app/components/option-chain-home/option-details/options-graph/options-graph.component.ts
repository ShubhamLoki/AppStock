import {
  OPT_STR,
  CE,
  PE,
  OPT_STR_FULL,
} from './../../../../constants/common.constants';
import { OptionChainService } from './../../../../services/option-chain.service';
import { Component, OnInit, Input } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-options-graph',
  templateUrl: './options-graph.component.html',
  styleUrls: ['./options-graph.component.scss'],
})
export class OptionsGraphComponent implements OnInit {
  @Input() strikePrice;
  @Input() symbol;
  @Input() optionObj;
  @Input() multiply;
  @Input() activeTab;
  @Input() underlyingValue;
  @Input() pcRatio;
  @Input() strikePrices: Array<any>;

  arrayObj;
  OPT_STR = OPT_STR;
  tabLabel;
  timeInterval;
  autoRefreshTime;

  public chartDatasets: Array<any> = [];
  public chartLabels: Array<any> = [];
  chartReady = false;
  status = 'Loading...';

  constructor(
    private optionChainService: OptionChainService,
    private clipboard: Clipboard
  ) {}

  ngOnInit(): void {
    this.loadOptionChain();
  }

  private loadOptionChain(): void {
    this.optionChainService
      .getOptionChainAll(this.symbol, this.strikePrice)
      .then((arrayObj) => {
        this.arrayObj = arrayObj;
        console.log(this.arrayObj);
        if (this.optionObj.CE) {
          this.optionObj.CE.changeinOpenInterest =
            arrayObj.ceArrays.coiList.slice(-1)[0] / this.multiply;
          this.optionObj.CE.openInterest =
            arrayObj.ceArrays.oiList.slice(-1)[0] / this.multiply;
        }
        if (this.optionObj.PE) {
          this.optionObj.PE.changeinOpenInterest =
            arrayObj.peArrays.coiList.slice(-1)[0] / this.multiply;
          this.optionObj.PE.openInterest =
            arrayObj.peArrays.oiList.slice(-1)[0] / this.multiply;
        }
        this.loadChardData();
      });
  }

  private loadChardData() {
    this.chartLabels = this.arrayObj.timeArray;
    this.chartDatasets = [];

    switch (this.activeTab) {
      case OPT_STR.COI:
        this.pushChartData(this.arrayObj.peArrays.coiList, PE);
        this.pushChartData(this.arrayObj.ceArrays.coiList, CE);
        this.tabLabel = OPT_STR_FULL.COI;
        break;
      case OPT_STR.OI:
        this.pushChartData(this.arrayObj.peArrays.oiList, PE);
        this.pushChartData(this.arrayObj.ceArrays.oiList, CE);
        this.tabLabel = OPT_STR_FULL.OI;
        break;
      case OPT_STR.LTP:
        this.pushChartData(this.arrayObj.peArrays.ltpArr, PE);
        this.pushChartData(this.arrayObj.ceArrays.ltpArr, CE);
        this.tabLabel = OPT_STR_FULL.LTP;
        break;
      case OPT_STR.IV:
        this.pushChartData(this.arrayObj.peArrays.ivArr, PE);
        this.pushChartData(this.arrayObj.ceArrays.ivArr, CE);
        this.tabLabel = OPT_STR_FULL.IV;
        break;
      case OPT_STR.VOL:
        this.pushChartData(this.arrayObj.peArrays.volumeArr, PE);
        this.pushChartData(this.arrayObj.ceArrays.volumeArr, CE);
        this.tabLabel = OPT_STR_FULL.VOL;
        break;
      // case OPT_STR.COIVR:
      //   this.pushChartData(this.arrayObj.peArrays.coiVolumeRationArr, PE);
      //   this.pushChartData(this.arrayObj.ceArrays.coiVolumeRationArr, CE);
      //   this.tabLabel = OPT_STR_FULL.COIVR;
      //   break;
    }
    this.chartReady = true;
    this.status = 'Loaded!';
  }

  private pushChartData(data: [], optionStr: string) {
    this.chartDatasets.push({
      data: data,
      label: optionStr + ' ' + this.activeTab,
    });
  }

  navClick(tabStr: string) {
    this.chartReady = false;
    this.status = 'Loading...';
    this.activeTab = tabStr;
    this.loadChardData();
  }

  // refresh(): void {
  //   this.chartReady = false;
  //   this.chartDatasets = [];
  //   this.status = 'Loading...';
  //   this.loadChardData();
  // }

  // reset() {
  //   this.status = 'Loading...';
  //   this.autoRefreshTime = new Date();
  //   clearInterval(this.timeInterval);
  //   this.loadChardData();
  //   this.timeInterval = setInterval(() => {
  //     this.autoRefreshTime = new Date();
  //     this.refresh();
  //   }, 3 * 60 * 1000);
  // }

  copyName() {
    this.clipboard.copy(this.symbol + ' ' + this.strikePrice);
  }

  getStrikePrice(index) {
    // this.chartReady = false;
    // this.status = 'Loading...';
    const currIndex = this.strikePrices.indexOf(this.strikePrice);
    this.strikePrice = this.strikePrices[currIndex + index];
    console.log(this.strikePrice);
    this.loadOptionChain();
  }
}
