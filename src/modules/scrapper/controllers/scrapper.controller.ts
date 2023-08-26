import { 
    Controller,
    Query,
    Body,
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

    @Get('check-subscribe/youtube')
    checkYoutubeSubscribe(
        @Body('urlChannel') urlChannel: string,
        @Body('subscriber')  subscriber: string[]
    ) {
        return this.scrapperService.checkYoutubeSubscribe(urlChannel, subscriber);
    }

    @Get('check-comment/youtube')
    checkYoutubeComment(
        @Body('urlChannel') urlChannel: string,
        @Body('comment')  comment: string
    ) {
        return this.scrapperService.checkYoutubeComment(urlChannel, comment);
    }

    @Get('check-valid/tiktok')
    isValidTiktokAccount(
        @Query('urlChannel') urlChannel: string,
        @Query('code') code: string
    ) {
        return this.scrapperService.isValidTiktokAccount(urlChannel, code);
    }

    // @Get('check-subscribe/tiktok')
    // checkTiktokSubscribe(@Query('urlChannel') urlChannel: string,) {
    //     return this.scrapperService.checkTiktokSubscribe(urlChannel);
    // }

    @Get('check-valid/twitter')
    isValidTwitterAccount(
        @Query('urlPost') urlPost: string,
        @Query('code') code: string
    ) {
        return this.scrapperService.isValidTwitterAccount(urlPost, code);
    }

    @Get('check-subscribe/twitter')
    checkTwitterSubscribe(
        @Body('urlChannel') urlChannel: string,
        @Body('subscriber')  subscriber: string[]
    ) {
        return this.scrapperService.checkTwitterSubscribe(urlChannel, subscriber);
    }

    @Get('check-rating/google')
    checkGoogleMapRating(
        @Body('urlLocation') urlLocation: string,
        @Body('username') username: string,
        @Body('comment') comment: string
    ) {
        return this.scrapperService.checkGoogleMapRating(urlLocation, username, comment);
    }

    @Get('check-valid/facebook')
    isValidFacebookAccount(
        @Query('urlChannel') urlChannel: string,
        @Query('code') code: string
    ) {
        return this.scrapperService.isValidFacebookAccount(urlChannel, code);
    }
    
    @Get('check-subscribe/facebook')
    checkFacebookSubscribe(
        @Body('urlChannel') urlChannel: string,
        @Body('subscriber')  subscriber: string[]
    ) {
        return this.scrapperService.checkFacebookSubscribe(urlChannel, subscriber);
    }

    @Get('download/video/facebook')
    downloadFacebookVideo(@Body('urlVideo') urlVideo: string) {
        return this.scrapperService.downloadFacebookVideo(urlVideo);
    }

    @Get('check-valid/instagram')
    isValidInstagramAccount(
        @Query('urlChannel') urlChannel: string,
        @Query('code') code: string
    ) {
        return this.scrapperService.isValidInstagramAccount(urlChannel, code);
    }
    
    @Get('check-subscribe/instagram')
    checkInstagramSubscribe(
        @Body('urlChannel') urlChannel: string,
        @Body('subscriber')  subscriber: string[]
    ) {
        return this.scrapperService.checkInstagramSubscribe(urlChannel, subscriber);
    }
}