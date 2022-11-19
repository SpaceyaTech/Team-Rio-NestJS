export default {
  db: {
    type: process.env.DB_TYPE as 'sqlite' | 'postgres' | 'mysql' | 'mariadb',
    database: process.env.DATABASE as string,
    synchronize: process.env.DB_SYNCHRONIZE as unknown as boolean,
    autoLoadEntities: process.env.DB_AUTO_LOAD_ENTITIES as unknown as boolean,
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpire: 60, // expires after 60 seconds
    jwtRefreshExpire: 60 * 60 * 24 * 1, // expires after a day
  },
};