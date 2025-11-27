import { Global, Module } from '@nestjs/common';
import { RolesGuard } from '../auth/roles.guard';

@Global()
@Module({
  providers: [RolesGuard],
  exports: [RolesGuard],
})
export class CommonModule {}
