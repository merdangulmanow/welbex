import { Module, Global } from '@nestjs/common';
import { PrismaException } from './prisma.exception';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService, PrismaException],
  exports: [PrismaService, PrismaException]
})
export class PrismaModule {}
