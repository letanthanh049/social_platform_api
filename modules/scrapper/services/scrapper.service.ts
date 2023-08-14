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
        const userInfoElement = await page.$('#inner-header-container');
        const userId = await userInfoElement.$eval('yt-formatted-string[id="text"]', element => element.textContent);
        const username = await userInfoElement.$eval('yt-formatted-string[id="channel-handle"]', element => element.textContent);
        const description = await userInfoElement.$eval('div[id="content"]', element => element.textContent.trim());
        let isValid = false;
        if (code === description) isValid = true;
        return {
            userId: userId,
            username: username,
            description: description,
            isValid: isValid
        };
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
        const channels = await page.$$eval('#contents #items ytd-grid-channel-renderer',
            elements => elements.map(
                channel => channel.querySelector('#channel-info').getAttribute('href')
            ));

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
        const context = browser.defaultBrowserContext();
        await context.overridePermissions(urlChannel, ['notifications']); 
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 480 });
        await page.goto(urlChannel);
        await page.waitForSelector('.e1457k4r3');
        const userInfoElement = await page.$('.tiktok-1g04lal-DivShareLayoutHeader-StyledDivShareLayoutHeaderV2');
        const userId = await userInfoElement.$eval('h1[data-e2e="user-title"]', element => element.textContent.trim());
        const username = await userInfoElement.$eval('h2[data-e2e="user-subtitle"]', element => element.textContent.trim());
        const userBio = await userInfoElement.$eval('.e1457k4r3', element => element.textContent.trim());
        let isValid = false;
        if (userBio === code) isValid = true;
        return {
            userId: userId,
            username: username,
            userBio: userBio,
            isValid: isValid
        };
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
        const userInfoElement = await page.$('div[data-testid="User-Name"]')
        const userId = await userInfoElement.$$eval('.css-901oao.css-16my406.r-poiln3.r-bcqeeo.r-qvutc0', elements => elements[1].textContent);
        const username = await userInfoElement.$$eval('.css-901oao.css-16my406.r-poiln3.r-bcqeeo.r-qvutc0', elements => elements[3].textContent);
        const postCode = await page.$eval('div[data-testid="tweetText"]', element => element.querySelector('span').textContent);
        let isValid = false;
        if (code === postCode) isValid = true;
        return {
            userId: userId,
            username: username,
            postCode: postCode,
            isValid: isValid
        };
    }

    async checkTwitterSubcribe(urlChannel: string, subcriber: string) {
        const browser = await puppeteer.launch({ headless: 'new' });
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
        let followingList = await containerElement.$$eval('div[data-testid="cellInnerDiv"]',
            elements => elements.map(
                user => user.querySelector('a').getAttribute('href')
            ));
        for (let i = 1; i <= 2; i++) {
            await page.evaluate(() => {
                window.scrollBy(0, window.innerHeight + 1700);
                setTimeout(() => { console.log("Channel is loading") }, 1400);
            });
            const containerElement = await page.$('section[role=region]');
            const newFollowingList = await containerElement.$$eval('div[data-testid="cellInnerDiv"]',
                elements => elements.map(
                    user => user.querySelector('a').getAttribute('href')
                ));
            followingList = [...followingList, ...newFollowingList]
        }

        let isExist = false;
        followingList.forEach(user => {
            if (user === subcriber) {
                isExist = true;
                return;
            }
        });
        return isExist;
    }

    async checkGoogleMapRating(urlLocation: string, username: string, comment: string) {
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        await page.setViewport({ width: 900, height: 1280 });
        await page.goto(urlLocation);
        await page.waitForSelector('.RWPxGd');
        await page.click('.RWPxGd button:nth-child(2)');
        await page.waitForSelector('button[aria-label="Sort reviews"]');
        await page.click('button[aria-label="Sort reviews"]');
        await page.waitForSelector('div[role="menuitemradio"]');
        await page.click('.fontBodyLarge.yu5kgd>div:nth-child(2)');
        await page.keyboard.press('Backspace', { delay: 1000 });
        await page.$eval('.m6QErb.DxyBCb.kA9KIf.dS8AEf', element => {
            for (let i = 1; i <= 10; i++) {
                setTimeout(() => {
                    element.scrollBy(0, element.scrollHeight + 1200);
                    console.log("Rating is loading");
                }, i * 500);
            }
        });
        /** 
         * Promise này dùng để chờ sau khi scroll xong hết 10 lần mới lấy danh sách rating
         * => thời gian chờ của promise = tổng số lần scroll (hiện tại là 10) * 500
         */
        const promise = new Promise((resolve
        ) => {
            setTimeout(async () => {
                resolve(await page.$$eval('.jftiEf.fontBodyMedium', elements => elements.map(
                    ratingInfo => {
                        return {
                            username: ratingInfo.getAttribute('aria-label'),
                            rating: ratingInfo.querySelector('.kvMYJc').getAttribute('aria-label'),
                            comment: ratingInfo.querySelector('.wiI7pd')?.innerHTML,
                            timeRating: ratingInfo.querySelector('.rsqaWe').innerHTML,
                        }
                    }
                )))
            }, 5000);
        });
        const users: any = await promise;
        console.log('Total Users: ', users.length);
        
        let isValid = false;
        let userInfo;
        users.forEach(user => {
            if (user.username === username && user.comment === comment) {
                isValid = true;
                userInfo = {
                    username: user.username,
                    rating: user.rating,
                    comment: user.comment,
                    timeRating: user.timeRating,
                    isValid: isValid
                }
                return;
            }
        });
        return userInfo ? userInfo : "User not Exist";
    }
}