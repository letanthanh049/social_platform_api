import { 
    Controller,
    Body,
    Get,
} from "@nestjs/common";
import { ScrapperService } from "../services/scrapper.service";

@Controller('scrapper')
export class ScrapperController {
    constructor(private readonly scrapperService: ScrapperService) { }

    @Get('check-valid/facebook')
    isValidFacebookAccount(
        @Body('urlProfile') urlProfile: string,
        @Body('code') code: string
    ) {
        return this.scrapperService.isValidFacebookAccount(urlProfile, code);
    }
    
    @Get('check-subscribe/facebook')
    checkFacebookSubscribe(
        @Body('urlProfile') urlProfile: string,
        @Body('subscriber')  subscriber: string[]
    ) {
        return this.scrapperService.checkFacebookSubscribe(urlProfile, subscriber);
    }

    @Get('check-comment/facebook')
    checkFacebookComment(
        @Body('urlPost') urlPost: string,
        @Body('comment') comment: string
    ) {
        return this.scrapperService.checkFacebookComment(urlPost, comment);
    }

    @Get('download/video/facebook')
    downloadFacebookVideo(@Body('urlVideo') urlVideo: string) {
        return this.scrapperService.downloadFacebookVideo(urlVideo);
    }

    @Get('check-valid/instagram')
    isValidInstagramAccount(
        @Body('urlChannel') urlChannel: string,
        @Body('code') code: string
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

    @Get('check-valid/twitter')
    isValidTwitterAccount(
        @Body('urlTweet') urlTweet: string,
        @Body('code') code: string
    ) {
        return this.scrapperService.isValidTwitterAccount(urlTweet, code);
    }

    @Get('check-subscribe/twitter')
    checkTwitterSubscribe(
        @Body('urlChannel') urlChannel: string,
        @Body('subscriber')  subscriber: string[]
    ) {
        return this.scrapperService.checkTwitterSubscribe(urlChannel, subscriber);
    }

    @Get('check-comment/twitter')
    checkTwitterComment(
        @Body('urlTweet') urlTweet: string,
        @Body('comment') comment: string
    ) {
        return this.scrapperService.checkTwitterComment(urlTweet, comment);
    }

    @Get('check-valid/tiktok')
    isValidTiktokAccount(
        @Body('urlChannel') urlChannel: string,
        @Body('code') code: string
    ) {
        return this.scrapperService.isValidTiktokAccount(urlChannel, code);
    }

    @Get('check-valid/youtube')
    isValidYoutubeAccount(
        @Body('urlChannel') urlChannel: string,
        @Body('code') code: string
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

    @Get('check-rating/google')
    checkGoogleMapRating(
        @Body('urlLocation') urlLocation: string,
        @Body('username') username: string,
        @Body('comment') comment: string
    ) {
        return this.scrapperService.checkGoogleMapRating(urlLocation, username, comment);
    }
}