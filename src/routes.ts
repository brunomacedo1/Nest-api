import { Routes } from 'nest-router';
import { UserModule } from './user/user.module';

export const routes: Routes = [
  {
    path: '/api',
    module: UserModule,
  },
];