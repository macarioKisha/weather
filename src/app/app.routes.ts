import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { Services } from './function/services';
export const routes: Routes = [
    {path: 'dashboard', component: Dashboard},
    {path: 'services', component: Services}
];
