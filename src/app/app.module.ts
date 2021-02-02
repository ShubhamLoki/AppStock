import { DialogService } from './services/dialog.service';
import { YahooFinanceApiServiceService } from './services/rest-api/yahoo.finance.api.service';
import { StockApiService } from './services/rest-api/stock.api.service';
import { OptionChainService } from './services/option-chain.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ApiService } from './services/rest-api/api.service';
import { StockDivergenceService } from './services/stock.divergence.service';
import { HeikenAshiService } from './services/heiken-ashi.service';
import { PromotersBuyService } from './services/promoters-buy.service';
import { CommonService } from './services/common.service';
import { StockCalculationService } from './services/stock.calculation.service';

import { HttpClientModule } from '@angular/common/http';
import { DivergenceHomeComponent } from './components/divergence-home/divergence-home.component';
import { StockDivergenceHistoryComponent } from './components/divergence-home/stock-divergence-history/stock-divergence-history.component';
import { DayDivergenceComponent } from './components/divergence-home/day-divergence/day-divergence.component';
import { RouterModule } from '@angular/router';
import { ROUTES } from 'src/app/configs/routes.config';
import { WishListComponent } from './components/divergence-home/wish-list/wish-list.component';
import { HeikenAshiHomeComponent } from './components/heiken-ashi-home/heiken-ashi-home.component';
import { AppHomeComponent } from './components/app-home/app-home.component';
import { ChartsModule, MDBBootstrapModule } from 'angular-bootstrap-md';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AnalysisDataComponent } from './components/heiken-ashi-home/analysis-data/analysis-data.component';
import { HistoryDataComponent } from './components/heiken-ashi-home/history-data/history-data.component';
import { PromotersBuyHomeComponent } from './components/promoters-buy-home/promoters-buy-home.component';
import { OptionChainHomeComponent } from './components/option-chain-home/option-chain-home.component';
import { MatSelectModule } from '@angular/material/select';
import { OptionAnalysisComponent } from './components/option-chain-home/option-analysis/option-analysis.component';
import { GraphCanvasComponent } from './components/graph-canvas/graph-canvas.component';
import { OptionDetailsComponent } from './components/option-chain-home/option-details/option-details.component';
import { OptionsCompareComponent } from './components/option-chain-home/options-compare/options-compare.component';
import { OptionsCoiGraphComponent } from './components/option-chain-home/option-details/options-coi-graph/options-coi-graph.component';
import { OptionsGraphComponent } from './components/option-chain-home/option-details/options-graph/options-graph.component';
import { ClipboardModule } from '@angular/cdk/clipboard';

@NgModule({
  declarations: [
    AppComponent,
    DivergenceHomeComponent,
    StockDivergenceHistoryComponent,
    DayDivergenceComponent,
    WishListComponent,
    HeikenAshiHomeComponent,
    AppHomeComponent,
    AnalysisDataComponent,
    HistoryDataComponent,
    PromotersBuyHomeComponent,
    OptionChainHomeComponent,
    OptionAnalysisComponent,
    GraphCanvasComponent,
    OptionDetailsComponent,
    OptionsCompareComponent,
    OptionsCoiGraphComponent,
    OptionsGraphComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ChartsModule,
    MDBBootstrapModule.forRoot(),
    RouterModule.forRoot(ROUTES),
    MatTabsModule,
    NgbModule,
    MatSelectModule,
    ClipboardModule,
  ],
  providers: [
    ApiService,
    StockDivergenceService,
    HeikenAshiService,
    PromotersBuyService,
    CommonService,
    StockCalculationService,
    OptionChainService,
    StockApiService,
    YahooFinanceApiServiceService,
    DialogService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
