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

    async getDataFromWebsite() {
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 14000 })
        await page.goto('https://www.youtube.com/@letanthanh9866/channels',);
        await page.evaluate(() => { window.scrollBy(0, window.innerHeight); });
        await page.keyboard.press('Backspace', { delay: 2000 });
        const allChannelsEleHandle = await page.$$('#contents #items ytd-grid-channel-renderer');
        const promises = allChannelsEleHandle.map(
            async (eleHandle) => {
                // return await eleHandle.evaluate((domElement) => domElement.outerHTML);
                // return await eleHandle.$eval('#title', element => element.textContent)
                return await eleHandle.$eval('#channel-info', element => element.getAttribute('href'))
            });
        const channels = await Promise.all(promises);

        let isExist = false;
        channels.forEach(ch => {
            // if (ch.length == 'L'.length && ch === 'L') {
            //     isExist = true;
            //     return;
            // }
            if (ch === '/@TheKidLAROI') {
                isExist = true;
                return;
            }
        })
        await browser.close();
        return isExist;
    };
}