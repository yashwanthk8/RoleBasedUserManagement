import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Register } from './register/register';
import { authGuard } from './services/auth.guard';
import { UserList } from './adminDashboard/user-list';
import { roleGuard } from './services/role.guard';
import { UnAuthUser } from './userDashboard/un-auth-user';
import { Homepage } from './homepage/homepage';
import { UserDetails } from './user-details/user-details';

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
    data: { allowAdmin: true }
  },
  { path: 'user-details/:id', component: UserDetails , canActivate: [authGuard], },
  { path: '**', redirectTo: 'login' }
];
