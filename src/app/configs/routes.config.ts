import { Routes } from '@angular/router';
import { DivergenceComponent } from '../components/divergence/divergence.component';
import { DivergenceListComponent } from '../components/divergence-list/divergence-list.component';
import { WishListComponent } from '../components/wish-list/wish-list.component';
import { AppHomeComponent } from '../components/app-home/app-home.component';
import { HeikenAshiHomeComponent } from '../components/heiken-ashi-home/heiken-ashi-home.component';

export const ROUTES: Routes = [
  {
    path: 'hourly',
    component: DivergenceComponent,
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
    path: '**',
    component: DivergenceListComponent,
  },
];
