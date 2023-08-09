import { Module } from '@nestjs/common';
import { YoutubeController } from './controllers/youtube.controller';
import { YoutubeSerivce } from './services/youtube.service';

@Module({
    controllers: [YoutubeController],
    providers: [YoutubeSerivce]
})
export class YoutubeModule {}