import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrderModule } from './order/order.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(String(process.env.MONGODB_URL)),
    OrderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
