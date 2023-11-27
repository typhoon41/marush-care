/* eslint-disable @stylistic/max-len */
import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', loadComponent: () => import('./features/home/home-page.component').then(mod => mod.HomePageComponent) },
    { path: 'home', loadComponent: () => import('./features/home/home-page.component').then(mod => mod.HomePageComponent) }
];
