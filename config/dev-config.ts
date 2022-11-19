export default {
  db: {
    type: 'sqlite' as 'sqlite' | 'postgres' | 'mysql' | 'mariadb',
    database: 'db.sqlite',
    synchronize: true,
    autoLoadEntities: true,
  },
  auth: {
    jwtSecret: '6gJi7^e941VD^m^q7SFBCOv&ZIxHL*94fvDO',
    jwtExpire: 30, // expires after 30 seconds
    jwtRefreshExpire: 60 * 60 * 24 * 1, // expires after a day
  },
};
