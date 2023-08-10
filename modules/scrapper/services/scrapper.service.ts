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

    async checkYoutubeSubcribe(urlChannel: string, subcriber: string) {
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 14000 });
        await page.goto(urlChannel);
        await page.evaluate(() => { window.scrollBy(0, window.innerHeight); });
        await page.keyboard.press('Backspace', { delay: 2000 });
        const allChannelsElement = await page.$$('#contents #items ytd-grid-channel-renderer');
        const promises = allChannelsElement.map(
            async (channel) => {
                // return await channel.evaluate((domElement) => domElement.outerHTML);
                // return await channel.$eval('#title', element => element.textContent)
                return await channel.$eval('#channel-info', element => element.getAttribute('href'))
            });
        const channels = await Promise.all(promises);

        let isExist = false;
        channels.forEach(ch => {
            if (ch === subcriber) {
                isExist = true;
                return;
            }
        })
        await browser.close();
        return isExist;
    };

    async isValidTiktokAccount(urlChannel: string, code: string) {
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 480 });
        await page.goto(urlChannel);
        const userBioElement = await page.$('.tiktok-1g04lal-DivShareLayoutHeader-StyledDivShareLayoutHeaderV2');
        const userBio = await userBioElement.$eval('.e1457k4r3', element => element.textContent);
        let isValid = false;
        if (userBio === code) isValid = true;
        return isValid;
    }

    async checkTiktokSubcribe(urlChannel: string) {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 800});
        await page.goto(urlChannel);
        const followingListElement = await page.$$('.tiktok-j1fxk6-UlAccountList');
        const promises = followingListElement.map(
            async (followingUserElement) => {
                return (await followingUserElement.getProperty('outerHTML'))
            }
        )
        const userList = await Promise.all(promises); 
        console.log(userList);
        return userList;
    }
}