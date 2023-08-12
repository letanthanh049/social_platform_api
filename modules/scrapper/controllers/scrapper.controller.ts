import { 
    Controller,
    Query,
    Get,
} from "@nestjs/common";
import { ScrapperService } from "../services/scrapper.service";

@Controller('scrapper')
export class ScrapperController {
    constructor(private readonly scrapperService: ScrapperService) { }

    @Get('check-valid/youtube')
    isValidYoutubeAccount(
        @Query('urlChannel') urlChannel: string,
        @Query('code') code: string
    ) {
        return this.scrapperService.isValidYoutubeAccount(urlChannel, code);
    }

    @Get('check-subcribe/youtube')
    checkYoutubeSubcribe(
        @Query('urlChannel') urlChannel: string,
        @Query('subcriber')  subcriber: string
    ) {
        return this.scrapperService.checkYoutubeSubcribe(urlChannel, subcriber);
    }

    @Get('check-valid/tiktok')
    isValidTiktokAccount(
        @Query('urlChannel') urlChannel: string,
        @Query('code') code: string
    ) {
        return this.scrapperService.isValidTiktokAccount(urlChannel, code);
    }

    // @Get('check-subcribe/tiktok')
    // checkTiktokSubcribe(@Query('urlChannel') urlChannel: string,) {
    //     return this.scrapperService.checkTiktokSubcribe(urlChannel);
    // }

    @Get('check-valid/twitter')
    isValidTwitterAccount(
        @Query('urlPost') urlPost: string,
        @Query('code') code: string
    ) {
        return this.scrapperService.isValidTwitterAccount(urlPost, code);
    }

    @Get('check-subcribe/twitter')
    checkTwitterSubcribe(
        @Query('urlChannel') urlChannel: string,
        @Query('subcriber')  subcriber: string
    ) {
        return this.scrapperService.checkTwitterSubcribe(urlChannel, subcriber);
    }

    @Get('check-rating/google')
    checkGoogleMapRating(
        @Query('urlLocation') urlLocation: string,
        @Query('username') username: string
    ) {
        return this.scrapperService.checkGoogleMapRating(urlLocation, username);
    }
}