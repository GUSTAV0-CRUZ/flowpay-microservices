import { Module } from '@nestjs/common';
import { ClientProxyService } from './client-proxy.service';

@Module({
  providers: [ClientProxyService],
})
export class ClientProxyModule {}
