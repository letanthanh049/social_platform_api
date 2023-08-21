import { Module } from '@nestjs/common';
import { YoutubeModule } from './modules/youtube/youtube.module';
import { ConfigModule } from '@nestjs/config';
import { TiktokModule } from './modules/tiktok/tiktok.module';
import { TwitterModule } from './modules/twitter/twitter.module';
import { ScrapperModule } from './modules/scrapper/scrapper.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        MongooseModule.forRoot('mongodb://127.0.0.1:27017/social_platform_api'),
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