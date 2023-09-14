import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScrapperModule } from './modules/scrapper/scrapper.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true
        }),
        ScrapperModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }