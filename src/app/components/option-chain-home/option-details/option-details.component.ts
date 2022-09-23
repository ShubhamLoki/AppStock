import { OptionsGraphComponent } from './options-graph/options-graph.component';
import { DialogService } from './../../../services/dialog.service';
import { NIFTY, OPT_STR } from './../../../constants/common.constants';
import { Option } from './../../../models/option.model';
import { OptionChainService } from './../../../services/option-chain.service';
import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { OptionsCoiGraphComponent } from './options-coi-graph/options-coi-graph.component';

@Component({
  selector: 'app-option-details',
  templateUrl: './option-details.component.html',
  styleUrls: ['./option-details.component.scss'],
})
export class OptionDetailsComponent implements OnInit, OnDestroy {
  @Input() symbol;

  optionMap: Map<string, any>;

  underlyingValue;
  pcRatio;
  lastUpdatedAt;
  autoRefreshTime;
  stockOIList;
  status = 'Loading...';
  OPT_STR = OPT_STR;

  multiply = 1;
  timeInterval;
  constructor(
    private optionChainService: OptionChainService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    console.log('************************');
    this.autoRefreshTime = new Date();
    if (this.symbol === NIFTY) {
      this.multiply = 75;
    } else {
      this.multiply = 25;
    }

    this.optionMap = new Map();
    this.loadOptionFeed();
    this.timeInterval = setInterval(() => {
      this.autoRefreshTime = new Date();
      this.refresh();
    }, 3 * 60 * 1000); // run on every 3 min
  }

  ngOnDestroy() {
    clearInterval(this.timeInterval);
  }

  loadOptionFeed(): void {
    this.optionChainService.getOptionFeed(this.symbol).then((data: any) => {
      const stockOI = data.content[0];
      this.underlyingValue = stockOI.underlyingValue;
      this.pcRatio = stockOI.pcRatio;
      this.lastUpdatedAt = stockOI.creationDateTime;
      this.stockOIList = stockOI.stockOIList;
      this.loadOptionDetails();
    });
  }

  loadOptionDetails(): void {
    this.optionChainService.getOptionDetails(this.symbol).then((data) => {
      console.log(data);
      // this.optionMap = new Map();
      data.forEach((option: Option) => {
        const tempOption = this.optionMap.get(option.strikePrice);
        let tempObj = {
          [option.optionStr]: option,
        };
        if (tempOption) {
          tempObj = {
            ...tempOption,
            [option.optionStr]: option,
          };
          this.optionMap.set(option.strikePrice, tempObj);
        } else {
          this.optionMap.set(option.strikePrice, tempObj);
        }
      });

      // console.log(this.optionMap);
      this.status = 'Loaded!';
    });
  }

  getIndex(strikePrice): string {
    let indexRet = -1;
    let optionType = null;
    this.stockOIList.forEach((stock, index) => {
      if (stock.strikePrice === strikePrice && stock.type !== 'MAXPP') {
        indexRet = index;
        optionType = stock.type;
      }
    });

    return optionType;
  }

  getMaxPPIndex(strikePrice): number {
    let indexRet = -1;
    this.stockOIList.forEach((stock, index) => {
      if (stock.strikePrice === strikePrice && stock.type === 'MAXPP') {
        indexRet = index;
      }
    });

    return indexRet;
  }

  refresh(): void {
    this.status = 'Loading...';
    this.loadOptionFeed();
  }

  reset() {
    this.status = 'Loading...';
    this.autoRefreshTime = new Date();
    clearInterval(this.timeInterval);
    this.loadOptionFeed();
    this.timeInterval = setInterval(() => {
      this.autoRefreshTime = new Date();
      this.refresh();
    }, 3 * 60 * 1000);
  }

  public getSignalClass(value): string {
    let classStr = '';
    classStr =
      value > 0
        ? value > (this.multiply == 75 ? 1000000 : 333000)
          ? 'text-success font-weight-bold'
          : 'text-success'
        : 'text-danger font-weight-bold';
    return classStr;
  }

  getLtpClass(value): string {
    return value > 0 ? 'text-success font-weight-bold' : 'text-danger';
  }

  trackByFn(index, optionObj): string {
    return optionObj.key;
  }

  openCOIDialog(optionObj) {
    this.refresh();
    const dialogRef = this.dialogService.open(OptionsCoiGraphComponent);

    dialogRef.componentInstance.strikePrice = optionObj.key;
    dialogRef.componentInstance.symbol = this.symbol;
    dialogRef.componentInstance.optionObj = optionObj;
    dialogRef.componentInstance.multiply = this.multiply;
  }

  openChart(optionObj, activeTab: string, optionStr?: string) {
    this.refresh();
    const dialogRef = this.dialogService.open(OptionsGraphComponent);

    dialogRef.componentInstance.strikePrice = optionObj.key;
    dialogRef.componentInstance.symbol = this.symbol;
    dialogRef.componentInstance.optionObj = optionObj.value;
    dialogRef.componentInstance.multiply = this.multiply;
    dialogRef.componentInstance.activeTab = activeTab;
    dialogRef.componentInstance.underlyingValue = this.underlyingValue;
    dialogRef.componentInstance.pcRatio = this.pcRatio;
    dialogRef.componentInstance.strikePrices = [...this.optionMap.keys()];
    dialogRef.componentInstance.activeOption = optionStr;
  }
}
