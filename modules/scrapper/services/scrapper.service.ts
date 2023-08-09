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

    async autoScroll(page: any) {
        await page.evaluate(async () => {
            await new Promise<void>((resolve) => {
                let totalHeight = 0;
                const distance = 16
                
                const timer = setInterval(() => {
                    const scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;

                    if (totalHeight >= scrollHeight) {
                        clearInterval(timer);
                        resolve();
                    }
                }, 1000);
            });
        });
    }

    async getDataFromWebsite() {
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        await page.goto('https://www.youtube.com/@EddievanderMeer/channels?view=56&shelf_id=0', {});

        // Scroll to the bottom of the page to load more subscribed channels
        await this.autoScroll(page);

        // Capture the DOM after scrolling
        const DOM = await page.content();

        await browser.close();
        return DOM;
    };
}