import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { CountySourcesModule } from './county_sources/county_sources.module';


@Module({
imports: [
  ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
  }),

  TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    autoLoadEntities: true,
  }),

  CountySourcesModule,
]

,

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}