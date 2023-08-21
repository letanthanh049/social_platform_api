import { Module } from '@nestjs/common';
import { TwitterController } from './controllers/twitter.controller';
import { TwitterService } from './services/twitter.service';

@Module({
    controllers: [TwitterController],
    providers: [TwitterService]
})
export class TwitterModule {}