import { Injectable } from "@nestjs/common";
import { Scrapper } from "../schema/scrapper.schema";
import { InjectModel } from "@nestjs/mongoose";
import mongoose from "mongoose";
import puppeteer from "puppeteer";

@Injectable()
export class ScrapperService {
    constructor(
        @InjectModel(Scrapper.name)
        private readonly scrapperModel: mongoose.Model<Scrapper>
    ) { }

    async isValidYoutubeAccount(urlChannel: string, code: string) {
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 400 });
        await page.goto(urlChannel);
        await page.waitForSelector('#content');
        const descriptionEle = await page.$('#channel-tagline');
        const description = await descriptionEle.$eval('#content', element => element.textContent.trim());
        let isValid = false;
        if (code === description) isValid = true;
        return isValid;
    }

    /**************************************************************************************************************
     * Chỉ cào được một phần channel
     * Nếu muốn cào thêm, tăng height lên => tăng delay time vì phải cho channel load sau khi scroll
     * hoặc xuất ra thông báo rằng người nhận nhiệm vụ phải giảm bớt số kênh cũ, đã được duyệt hoặc không cần thiết
     * chỉ chừa lại những kênh có trong nhiệm vụ subcribe
     ****/
    async checkYoutubeSubcribe(urlChannel: string, subcriber: string) {
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 14000 });
        await page.goto(urlChannel);
        await page.evaluate(() => { window.scrollBy(0, window.innerHeight); });
        await page.keyboard.press('Backspace', { delay: 2000 });
        const channelListElement = await page.$$('#contents #items ytd-grid-channel-renderer');
        const promises = channelListElement.map(
            async (channel) => {
                return await channel.$eval('#channel-info', element => element.getAttribute('href'))
            });
        const channels = await Promise.all(promises);

        // const channels = await page.$$eval('#contents #items ytd-grid-channel-renderer',
        //     elements => elements.map(
        //         channel => channel.querySelector('#channel-info').getAttribute('href')
        //     ));

        let isExist = false;
        channels.forEach(ch => {
            if (ch === subcriber) {
                isExist = true;
                return;
            }
        })
        return isExist;
    };

    async isValidTiktokAccount(urlChannel: string, code: string) {
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 480 });
        await page.goto(urlChannel);
        await page.waitForSelector('.e1457k4r3');
        const userBioElement = await page.$('.tiktok-1g04lal-DivShareLayoutHeader-StyledDivShareLayoutHeaderV2');
        const userBio = await userBioElement.$eval('.e1457k4r3', element => element.textContent.trim());
        let isValid = false;
        if (userBio === code) isValid = true;
        return isValid;
    }

    /**************************************************************************** 
     * Vì phải đăng nhập vào tiktok mới xem được following list 
     * nên phải cần tài khoản của người làm nhiệm vụ mới cào đc => không khả thi
     */
    // async checkTiktokSubcribe(urlChannel: string) {
    //     const browser = await puppeteer.launch({ headless: false });
    //     const page = await browser.newPage();
    //     await page.setViewport({ width: 1280, height: 800});
    //     await page.goto(urlChannel);
    //     const followingListElement = await page.$$('.tiktok-j1fxk6-UlAccountList');
    //     const promises = followingListElement.map(
    //         async (followingUserElement) => {
    //             return (await followingUserElement.getProperty('outerHTML'))
    //         }
    //     )
    //     const userList = await Promise.all(promises); 
    //     console.log(userList);
    //     return userList;
    // }

    async isValidTwitterAccount(urlPost: string, code: string) {
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 400 });
        await page.goto(urlPost);
        await page.waitForSelector('div[data-testid="tweetText"]');
        const postCode = await page.$eval('div[data-testid="tweetText"]', element => element.querySelector('span').textContent);
        let isValid = false;
        if (code === postCode) isValid = true;
        return isValid;
    }

    async checkTwitterSubcribe(urlChannel: string, subcriber: string) {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.setViewport({ width: 900, height: 1280 });

        /* Phần đăng nhập */
        await page.goto('https://twitter.com/i/flow/login');
        await page.waitForSelector('input[autocomplete="username"]');
        await page.click('input[autocomplete="username"]');
        await page.keyboard.sendCharacter('thanhlt1521@gmail.com');
        await page.keyboard.press('Enter');
        await page.waitForSelector('input[autocomplete="on"]');
        await page.click('input[autocomplete="on"]');
        await page.keyboard.sendCharacter('GofiberV1521');
        await page.keyboard.press('Enter');
        await page.waitForSelector('input[autocomplete="current-password"]');
        await page.keyboard.sendCharacter('thanh10052001!');
        await page.keyboard.press('Enter');
        await page.waitForSelector('div[aria-label="Home timeline"]');

        /* Phần danh sách theo dõi */
        await page.goto(urlChannel);
        await page.waitForSelector('div[data-testid="cellInnerDiv"]');
        const containerElement = await page.$('section[role=region]');
        const followingList = await containerElement.$$eval('div[data-testid="cellInnerDiv"]',
            elements => elements.map(
                user => user.querySelector('a').getAttribute('href')
            ));

        let isExist = false;
        followingList.forEach(user => {
            if (user === subcriber) {
                isExist = true;
                return;
            }
        })
        return isExist;
        return 0;
    }

    // async checkValidShopeeAccount(urlChannel: string, code: string) {

    // }

    // async checkShopeeSubcribe(urlChannel: string) {

    // }

    // async checkValidLazadaAccount(urlChannel: string, code: string) {

    // }

    // async checkLazadaSubcribe(urlChannel: string) {

    // }

    // async checkValidGoogleMapAccount(urlChannel: string, code: string) {

    // }

    // async checkGoogleMapSubcribe(urlChannel: string) {

    // }
}