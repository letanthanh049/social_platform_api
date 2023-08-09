import { Module } from '@nestjs/common';
import { TiktokService } from './services/tiktok.service';
import { TiktokController } from './controllers/tiktok.controller';

@Module({
    controllers: [TiktokController],
    providers: [TiktokService],
})
export class TiktokModule {}