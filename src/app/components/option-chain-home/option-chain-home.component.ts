import { OptionAnalysisComponent } from './option-analysis/option-analysis.component';
import { Title } from '@angular/platform-browser';
import { OptionChainService } from 'src/app/services';
import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ViewChildren,
  QueryList,
  AfterViewInit,
} from '@angular/core';

@Component({
  selector: 'app-option-chain-home',
  templateUrl: './option-chain-home.component.html',
  styleUrls: ['./option-chain-home.component.scss'],
})
export class OptionChainHomeComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @Input() symbol;
  // ----------- Chart Data
  chartPDReady = false;
  showOptionAnalysis = true;
  showOptionChain = false;
  showOptionDetails = false;
  showOptionPD = false;
  showCOR = false;

  @ViewChildren(OptionAnalysisComponent)
  listAll: QueryList<OptionAnalysisComponent>;

  OCC = 'Compare';
  OCA = 'Analysis';
  OCD = 'Details';
  OCPD = 'Premium';
  //
  activeTab = this.OCA;

  public chartPDDatasets: Array<any> = [];

  public chartLabels: Array<any> = [];
  time = new Date();
  timeInterval;
  activeTimeInterval;

  constructor(
    private optionChainService: OptionChainService,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle(this.activeTab + ' ' + this.symbol);

    this.activeTimeInterval = setInterval(() => {
      this.time = new Date();
    }, 1000);

    this.timeInterval = setInterval(() => {
      if (this.showOptionPD) {
        this.loadOptionPremium();
      }
    }, 3 * 60 * 1000);
  }
  ngAfterViewInit() {
    this.listAll.forEach((alertInstance) => console.log(alertInstance));
  }
  ngOnDestroy() {
    clearInterval(this.timeInterval);
    clearInterval(this.activeTimeInterval);
  }

  openTab(name): void {
    this.activeTab = name;
    this.titleService.setTitle(name + ' ' + this.symbol);
    if (name == this.OCPD) {
      this.loadOptionPremium();
    }
  }

  //! NOT IN USE
  showOptionChainDiv(): void {
    this.showOptionAnalysis = false;
    this.showOptionChain = true;
    this.showOptionDetails = false;
    this.showOptionPD = false;
    this.showCOR = false;
  }
  //! NOT IN USE
  showOptionAnalysisDiv(): void {
    this.showOptionAnalysis = true;
    this.showOptionChain = false;
    this.showOptionDetails = false;
    this.showOptionPD = false;
    this.showCOR = false;
  }
  //! NOT IN USE
  showCORDiv(): void {
    this.showOptionAnalysis = false;
    this.showOptionChain = false;
    this.showOptionDetails = false;
    this.showOptionPD = false;
    this.showCOR = true;
  }
  //! NOT IN USE
  showOptionDetailsComp(): void {
    this.showOptionAnalysis = false;
    this.showOptionChain = false;
    this.showOptionDetails = true;
    this.showOptionPD = false;
    this.showCOR = false;
  }
  //! NOT IN USE
  showOptionPremiumDecay(): void {
    this.showOptionAnalysis = false;
    this.showOptionChain = false;
    this.showOptionDetails = false;
    this.showOptionPD = true;
    this.showCOR = false;

    this.loadOptionPremium();
  }

  private loadOptionPremium(): void {
    this.optionChainService.getOptionPremium(this.symbol).then((dataObj) => {
      console.log(dataObj);
      this.chartPDDatasets = [];
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
