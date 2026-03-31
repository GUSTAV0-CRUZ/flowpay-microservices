import { Module } from '@nestjs/common';
import { ClientProxyModule } from './client-proxy/client-proxy.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ClientProxyModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
