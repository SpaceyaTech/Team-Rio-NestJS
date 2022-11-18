import { readFileSync } from 'fs';

export interface DatabaseConfig {
  database: string;
  synchronize: boolean;
  autoLoadEntities: boolean;
}

interface Config {
  port: number;
  db: DatabaseConfig;
}

export default (): Config => {
  let configFile = readFileSync('../config.json', 'utf-8');
  if (process.env.NODE_ENV === 'production') {
    configFile = readFileSync('../dev-config.json', 'utf-8');
  }
  return JSON.parse(configFile.toString());
};
