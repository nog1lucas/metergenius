import { Module } from '@nestjs/common';
import { CustomerModule } from './modules/customer/customer.module';
import { MeasureModule } from './modules/measure/measure.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from './modules/logger/logger.module';
import { LoggerService } from './modules/logger/logger.service';
import typeormConfig from './configuration/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeormConfig],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('database'),
    }),
    CustomerModule,
    MeasureModule,
    LoggerModule,
  ],
  providers: [LoggerService],
})
export class AppModule {}
