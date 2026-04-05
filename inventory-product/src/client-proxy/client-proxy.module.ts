import { Module } from '@nestjs/common';
import { ClientProxyService } from './client-proxy.service';

@Module({
  providers: [ClientProxyService],
  exports: [ClientProxyService],
})
export class ClientProxyModule {}
