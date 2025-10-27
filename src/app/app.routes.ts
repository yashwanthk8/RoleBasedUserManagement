import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Register } from './register/register';
import { authGuard } from './services/auth.guard';
import { UserList } from './adminDashboard/user-list';
import { roleGuard } from './services/role.guard';
import { UnAuthUser } from './userDashboard/un-auth-user';
import { Home } from './navbar/home';
import { Homepage } from './homepage/homepage';

export const routes: Routes = [
  { path: '', component: Homepage },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'homePage', component: Homepage },
  {
    path: 'adminDashboard',
    component: UserList,
    canActivate: [authGuard, roleGuard],
  },
  {
    path: 'userDashboard',
    component: UnAuthUser,
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: 'login' }
];
