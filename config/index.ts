import prodConfig from './prod-config';
import devConfig from './dev-config';

export interface DbConfig {
  type: 'sqlite' | 'postgres' | 'mysql' | 'mariadb';
  database: string;
  synchronize: boolean;
  autoLoadEntities: boolean;
}

export interface AuthConfig {
  jwtSecret: string;
  jwtExpire: number;
  jwtRefreshExpire: number;
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
