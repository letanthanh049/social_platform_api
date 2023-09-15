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
    
    @Get('check-follower/facebook')
    checkFacebookFollower(
        @Body('urlProfile') urlProfile: string,
        @Body('follower')  follower: string[]
    ) {
        return this.scrapperService.checkFacebookFollower(urlProfile, follower);
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
    
    @Get('check-follower/instagram')
    checkInstagramFollower(
        @Body('urlChannel') urlChannel: string,
        @Body('follower')  follower: string[]
    ) {
        return this.scrapperService.checkInstagramFollower(urlChannel, follower);
    }

    @Get('check-valid/twitter')
    isValidTwitterAccount(
        @Body('urlTweet') urlTweet: string,
        @Body('code') code: string
    ) {
        return this.scrapperService.isValidTwitterAccount(urlTweet, code);
    }

    @Get('check-follower/twitter')
    checkTwitterFollower(
        @Body('urlChannel') urlChannel: string,
        @Body('follower')  follower: string[]
    ) {
        return this.scrapperService.checkTwitterFollower(urlChannel, follower);
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

    @Get('check-subscriber/youtube')
    checkYoutubeSubscribe(
        @Body('urlChannel') urlChannel: string,
        @Body('subscriber')  subscriber: string[]
    ) {
        return this.scrapperService.checkYoutubeSubscriber(urlChannel, subscriber);
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