import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ApiService } from './services/api.service';
import { StockDivergenceService } from './services/stock.divergence.service';
import { HeikenAshiService } from './services/heiken-ashi.service';

import { HttpClientModule } from '@angular/common/http';
import { DivergenceHomeComponent } from './components/divergence-home/divergence-home.component';
import { StockDivergenceHistoryComponent } from './components/divergence-home/stock-divergence-history/stock-divergence-history.component';
import { DayDivergenceComponent } from './components/divergence-home/day-divergence/day-divergence.component';
import { RouterModule } from '@angular/router';
import { ROUTES } from 'src/app/configs/routes.config';
import { WishListComponent } from './components/divergence-home/wish-list/wish-list.component';
import { HeikenAshiHomeComponent } from './components/heiken-ashi-home/heiken-ashi-home.component';
import { AppHomeComponent } from './components/app-home/app-home.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AnalysisDataComponent } from './components/heiken-ashi-home/analysis-data/analysis-data.component';
import { HistoryDataComponent } from './components/heiken-ashi-home/history-data/history-data.component';

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
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MDBBootstrapModule.forRoot(),
    RouterModule.forRoot(ROUTES),
    MatTabsModule,
    NgbModule,
  ],
  providers: [ApiService, StockDivergenceService, HeikenAshiService],
  bootstrap: [AppComponent],
})
export class AppModule {}
