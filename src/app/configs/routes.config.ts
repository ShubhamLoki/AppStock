import { Routes } from '@angular/router';
import { DivergenceComponent } from '../components/divergence/divergence.component';
import { DivergenceListComponent } from '../components/divergence-list/divergence-list.component';
import { WishListComponent } from '../components/wish-list/wish-list.component';



export const ROUTES: Routes = [
  {
    path: 'hourly',
    component: DivergenceComponent
  },
  {
    path: 'wishlist',
    component: WishListComponent
  },
  {
    path: "**",
    component: DivergenceListComponent
  }
]