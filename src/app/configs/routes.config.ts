import { Routes } from '@angular/router';
import { StockDivergenceHistoryComponent } from '../components/divergence-home/stock-divergence-history/stock-divergence-history.component';
import { DivergenceHomeComponent } from '../components/divergence-home/divergence-home.component';
import { WishListComponent } from '../components/divergence-home/wish-list/wish-list.component';
import { AppHomeComponent } from '../components/app-home/app-home.component';
import { HeikenAshiHomeComponent } from '../components/heiken-ashi-home/heiken-ashi-home.component';

export const ROUTES: Routes = [
  {
    path: 'hourly',
    component: StockDivergenceHistoryComponent,
  },
  {
    path: 'wishlist',
    component: WishListComponent,
  },
  {
    path: 'heiken_ashi_home',
    component: HeikenAshiHomeComponent,
  },
  {
    path: 'app_home',
    component: AppHomeComponent,
  },
  {
    path: 'divergence_home',
    component: DivergenceHomeComponent,
  },
  {
    path: '**',
    component: AppHomeComponent,
  },
];
