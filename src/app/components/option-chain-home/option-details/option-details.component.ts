import { Option } from './../../../models/option.model';
import { OptionChainService } from './../../../services/option-chain.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-option-details',
  templateUrl: './option-details.component.html',
  styleUrls: ['./option-details.component.scss'],
})
export class OptionDetailsComponent implements OnInit {
  optionMap: Map<string, any>;

  underlyingValue;
  pcRatio;
  lastUpdatedAt;
  stockOIList;
  constructor(private optionChainService: OptionChainService) {}

  ngOnInit(): void {
    console.log('************************');
    this.loadOptionFeed();
    setInterval(() => {
      this.refresh();
    }, 3 * 60 * 1000); // run on every 3 min
  }

  loadOptionFeed(): void {
    this.optionChainService.getOptionFeed().then((data: any) => {
      const stockOI = data.content[0];
      this.underlyingValue = stockOI.underlyingValue;
      this.pcRatio = stockOI.pcRatio;
      this.lastUpdatedAt = stockOI.creationDateTime;
      this.stockOIList = stockOI.stockOIList;
      this.loadOptionDetails();
    });
  }

  loadOptionDetails(): void {
    this.optionMap = new Map();
    this.optionChainService.getOptionDetails().then((data) => {
      console.log(data);
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

      console.log(this.optionMap);
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
    this.loadOptionFeed();
  }

  public getSignalClass(value): string {
    return value > 0 ? 'text-success' : 'text-danger';
  }
}
