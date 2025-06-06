import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';


export const routes: Routes = [

  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
   {
    path: 'logout',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  }, 
  {
    path: 'layout',
    canActivate:[AuthGuard],
    loadComponent: () => import('./layout/layout.page').then(m => m.LayoutPage),
    children: [
       {
      path: '',
      loadComponent: () => import('./dashboard/dashboard.page').then(m => m.DashboardPage)
    },
      {
      path: 'dashboard',
      loadComponent: () => import('./dashboard/dashboard.page').then(m => m.DashboardPage)
    },
    {
      path: 'booking',
      loadComponent: () => import('./booking/booking.page').then(m => m.BookingPage)
    },
    {
    path: 'addbooking/:id/:date',
    loadComponent: () => import('./addbooking/addbooking.page').then( m => m.AddbookingPage)
  },
  ]
  },
  
  


];
