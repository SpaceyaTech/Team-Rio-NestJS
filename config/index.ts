import prodConfig from './prod-config';
import devConfig from './dev-config';

export interface DbConfig {
  type: 'sqlite' | 'postgres' | 'mysql' | 'mariadb';
  database: string;
  synchronize: boolean;
  autoLoadEntities: boolean;
}

export interface AdminConfig {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export interface AuthConfig {
  jwtSecret: string;
  jwtExpire: number;
  jwtRefreshExpire: number;
  admin: AdminConfig;
}

export interface Config {
  db: DbConfig;
  auth: AuthConfig;
}

export default () => {
  let config: Config;
  if (process.env.NODE_ENV === 'production') {
    config = prodConfig;
  }
  config = devConfig;
  return config;
};
