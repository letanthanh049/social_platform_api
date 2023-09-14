import { Injectable, OnModuleInit } from "@nestjs/common";
import puppeteer, { Page } from "puppeteer";
import { FacebookService } from "./facebook.service";
import { InstagramService } from "./instagram.service";
import { TwitterService } from "./twitter.service";
import { TiktokService } from "./tiktok.service";
import { GoogleService } from "./google.service";
import { YoutubeService } from "./youtube.service";

@Injectable()
export class ScrapperService implements OnModuleInit {
    private pageWidth = 1360;
    private page: Page;
    private facebookService: FacebookService;
    private instagramService: InstagramService;
    private twitterService: TwitterService;
    private tiktokService: TiktokService;
    private googleService: GoogleService;
    private youtubeService: YoutubeService;

    async onModuleInit() {
        const browser = await puppeteer.launch({ headless: false });
        const context = browser.defaultBrowserContext();
        /**
         * Mặc định sẽ override lên toàn bộ origin nếu không set gì hết
         */
        await context.overridePermissions(undefined, ['notifications']);
        this.page = await browser.newPage();
        this.facebookService = new FacebookService(this.page, this.pageWidth);
        this.instagramService = new InstagramService(this.page, this.pageWidth);
        this.twitterService = new TwitterService(this.page, this.pageWidth);
        this.tiktokService = new TiktokService(this.page, this.pageWidth);
        this.googleService = new GoogleService(this.page, this.pageWidth);
        this.youtubeService = new YoutubeService(this.page, this.pageWidth);
    }

    async isValidFacebookAccount(urlProfile: string, code: string) {
        return this.facebookService.isValidFacebookAccount(urlProfile, code);
    }

    async checkFacebookSubscribe(urlProfile: string, subscriber: string[]) {
        return this.facebookService.checkFacebookSubscribe(urlProfile, subscriber);
    }

    async checkFacebookComment(urlPost: string, comment: string) {
        return this.facebookService.checkFacebookComment(urlPost, comment);
    }

    async downloadFacebookVideo(urlVideo: string) {
        return this.facebookService.downloadFacebookVideo(urlVideo);
    }

    async isValidInstagramAccount(urlChannel: string, code: string) {
        return this.instagramService.isValidInstagramAccount(urlChannel, code);
    }

    async checkInstagramSubscribe(urlChannel: string, subscriber: string[]) {
        return this.instagramService.checkInstagramSubscribe(urlChannel, subscriber);
    }

    async isValidTwitterAccount(urlTweet: string, code: string) {
        return this.twitterService.isValidTwitterAccount(urlTweet, code);
    }

    async checkTwitterSubscribe(urlChannel: string, subscriber: string[]) {
        return this.twitterService.checkTwitterSubscribe(urlChannel, subscriber);
    }

    async checkTwitterComment(urlTweet: string, comment: string) {
        return this.twitterService.checkTwitterComment(urlTweet, comment);
    }

    async isValidTiktokAccount(urlChannel: string, code: string) {
        return this.tiktokService.isValidTiktokAccount(urlChannel, code);
    }

    async checkGoogleMapRating(urlLocation: string, username: string, comment: string) {
        return this.googleService.checkGoogleMapRating(urlLocation, username, comment);
    }

    async isValidYoutubeAccount(urlChannel: string, code: string) {
        return this.youtubeService.isValidYoutubeAccount(urlChannel, code);
    }

    async checkYoutubeSubscribe(urlChannel: string, subscriber: string[]) {
        return this.youtubeService.checkYoutubeSubscribe(urlChannel, subscriber);
    }

    async checkYoutubeComment(urlVideo: string, comment: string) {
        return this.youtubeService.checkYoutubeComment(urlVideo, comment);
    }
}