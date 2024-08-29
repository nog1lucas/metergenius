import { registerAs } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export default registerAs("database", (): TypeOrmModuleOptions => {
  const { DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME } = process.env;

  const config: TypeOrmModuleOptions = {
    type: "postgres",
    host: DB_HOST,
    port: Number(DB_PORT),
    database: DB_NAME,
    username: DB_USER,
    password: DB_PASS,
    synchronize: true,
    autoLoadEntities: true,
    entities: [`${__dirname}/../modules/**/*.entity.{js,ts}`],
    retryAttempts: 5,
    retryDelay: 3000, 
    extra: {
        encrypt: true,
        trueServerCertificate: true,
      },
  };

  return config;
});
