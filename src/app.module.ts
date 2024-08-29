import { Module } from '@nestjs/common';
import { CustomerModule } from './modules/customer/customer.module';
import { MeasureModule } from './modules/measure/measure.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get("database"),
    }),
    CustomerModule,
    MeasureModule
  ],
})
export class AppModule {}
