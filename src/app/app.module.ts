import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ApiService } from './services/api.service';
import { StockDivergenceService } from './services/stock.divergence.service';
import { HeikenAshiService } from './services/heiken-ashi.service';

import { HttpClientModule } from '@angular/common/http';
import { DivergenceListComponent } from './components/divergence-list/divergence-list.component';
import { DivergenceComponent } from './components/divergence/divergence.component';
import { DayDivergenceComponent } from './components/day-divergence/day-divergence.component';
import { RouterModule } from '@angular/router';
import { ROUTES } from 'src/app/configs/routes.config';
import { WishListComponent } from './components/wish-list/wish-list.component';
import { HeikenAshiHomeComponent } from './components/heiken-ashi-home/heiken-ashi-home.component';
import { AppHomeComponent } from './components/app-home/app-home.component';

@NgModule({
  declarations: [
    AppComponent,
    DivergenceListComponent,
    DivergenceComponent,
    DayDivergenceComponent,
    WishListComponent,
    HeikenAshiHomeComponent,
    AppHomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES),
  ],
  providers: [ApiService, StockDivergenceService, HeikenAshiService],
  bootstrap: [AppComponent],
})
export class AppModule {}
