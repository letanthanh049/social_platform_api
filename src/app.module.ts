import { Module } from '@nestjs/common';
import { YoutubeModule } from './modules/youtube/youtube.module';
import { ConfigModule } from '@nestjs/config';
import { TiktokModule } from './modules/tiktok/tiktok.module';
import { TwitterModule } from './modules/twitter/twitter.module';
import { ScrapperModule } from './modules/scrapper/scrapper.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true
        }),
        YoutubeModule,
        TiktokModule,
        TwitterModule,
        ScrapperModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }