import { Roles } from './roles';

export interface User{
    id: number;
    account_id: number;
    verified:boolean;
    first_name: string;
    last_name: string;
    username: string;
    password: string;
    email: string;
    phone: string;
    date_created: Date;
    date_updated: Date;
    roles: Roles[];
  }
