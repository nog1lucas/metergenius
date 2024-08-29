import { ConfigModule } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import typeormConfig from './typeorm.config';

ConfigModule.forRoot({
  isGlobal: true,
  load: [typeormConfig],
});

const options = {
  ...typeormConfig(),
  migrationsTableName: 'Migracoes',
  migrations: [`${__dirname}/../database/migrations/**/*.{js,ts}`],
  seeds: [`${__dirname}/../database/seeding/seeds/**/*.seeder.{ts,js}`],
  factories: [
    `${__dirname}/../database/seeding/factories/**/*.factory.{ts,js}`,
  ],
  migrationsRun: false,
} as DataSourceOptions & SeederOptions;

const dataSource: DataSource = new DataSource(options);

export default dataSource;
