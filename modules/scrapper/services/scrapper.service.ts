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
        const userInfoElement = await page.$('#channel-header-container');
        const avatar = await userInfoElement.$eval('img', element => element.getAttribute('src'));
        const userId = await userInfoElement.$eval('yt-formatted-string[id="text"]', element => element.textContent);
        const username = await userInfoElement.$eval('yt-formatted-string[id="channel-handle"]', element => element.textContent);
        const description = await userInfoElement.$eval('div[id="content"]', element => element.textContent.trim());
        await browser.close();

        let isValid = false;
        if (code === description) isValid = true;
        return {
            avatar: avatar,
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
     * chỉ chừa lại những kênh có trong nhiệm vụ subscribe
     ****/
    async checkYoutubeSubscribe(urlChannel: string, subscriber: string[]) {
        const completeList = [];
        const uncompleteList = subscriber.slice();

        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 10000 });
        await page.goto(urlChannel);
        await page.waitForSelector('#content');
        const userInfoElement = await page.$('#channel-header-container');
        const avatar = await userInfoElement.$eval('img', element => element.getAttribute('src'));
        const userId = await userInfoElement.$eval('yt-formatted-string[id="text"]', element => element.textContent);
        const username = await userInfoElement.$eval('yt-formatted-string[id="channel-handle"]', element => element.textContent);
        const description = await userInfoElement.$eval('div[id="content"]', element => element.textContent.trim());
        await page.keyboard.press('Backspace', { delay: 1500 });
        const channels = await page.$$eval('#contents #items ytd-grid-channel-renderer',
            elements => elements.map(
                channel => channel.querySelector('#channel-info').getAttribute('href')
            ));
        await browser.close();

        channels.forEach(ch => {
            uncompleteList.forEach((sub, index) => {
                if (ch === sub) completeList.push(uncompleteList.splice(index, 1)[0]);
            })
        });
        return {
            subscriber: subscriber,
            userInfo: {
                avatar: avatar,
                userId: userId,
                username: username,
                description: description,
                completeList: completeList,
                uncompleteList: uncompleteList
            }
        };
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
        const avatar = await userInfoElement.$eval('img', element => element.getAttribute('src'));
        const userId = await userInfoElement.$eval('h1[data-e2e="user-title"]', element => element.textContent);
        const username = await userInfoElement.$eval('h2[data-e2e="user-subtitle"]', element => element.textContent);
        const userBio = await userInfoElement.$eval('.e1457k4r3', element => element.textContent.trim());
        await browser.close();

        let isValid = false;
        if (userBio === code) isValid = true;
        return {
            avatar: avatar,
            userId: userId,
            username: username,
            userBio: userBio,
            isValid: isValid
        };
    }

    // async checkTiktokSubscribe(urlChannel: string) {
    //     const browser = await puppeteer.launch({ headless: false });
    //     const page = await browser.newPage();
    //     await page.goto(urlChannel);
    // const followingListElement = await page.$$('.tiktok-j1fxk6-UlAccountList');
    // const promises = followingListElement.map(
    //     async (followingUserElement) => {
    //         return (await followingUserElement.getProperty('outerHTML'))
    //     }
    // )
    // const userList = await Promise.all(promises); 
    // console.log(userList);
    // return userList;
    // }

    async isValidTwitterAccount(urlPost: string, code: string) {
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 400 });
        await page.goto(urlPost);
        await page.waitForSelector('div[data-testid="tweetText"]');
        await page.waitForSelector('.css-9pa8cd');
        const userInfoElement = await page.$('.css-1dbjc4n.r-18u37iz.r-15zivkp');
        const avatar = await userInfoElement.$eval('.css-9pa8cd', element => element.getAttribute('src'));
        const userId = await userInfoElement.$$eval('.css-901oao.css-16my406.r-poiln3.r-bcqeeo.r-qvutc0', elements => elements[1].textContent);
        const username = await userInfoElement.$$eval('.css-901oao.css-16my406.r-poiln3.r-bcqeeo.r-qvutc0', elements => elements[3].textContent);
        const postCode = await page.$eval('div[data-testid="tweetText"]', element => element.querySelector('span').textContent);
        await browser.close();

        let isValid = false;
        if (code === postCode) isValid = true;
        return {
            avatar: avatar,
            userId: userId,
            username: username,
            postCode: postCode,
            isValid: isValid
        };
    }

    async checkTwitterSubscribe(urlChannel: string, subscriber: string[]) {
        const completeList = [];
        const uncompleteList = subscriber.slice();

        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.setViewport({ width: 1300, height: 4000 });
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
        await page.click('input[autocomplete="current-password"]');
        await page.keyboard.sendCharacter('thanh10052001!');
        await page.keyboard.press('Enter');
        await page.waitForSelector('div[aria-label="Account menu"]');
        const userInfoElement = await page.$('div[aria-label="Account menu"]');
        const avatar = await userInfoElement.$eval('img', element => element.getAttribute('src'));
        const userId = await userInfoElement.$$eval('.css-901oao.css-16my406.r-poiln3.r-bcqeeo.r-qvutc0', elements => elements[1].textContent);
        const username = await userInfoElement.$$eval('.css-901oao.css-16my406.r-poiln3.r-bcqeeo.r-qvutc0', elements => elements[4].textContent);

        /* Phần danh sách theo dõi */
        await page.goto(urlChannel);
        await page.keyboard.press('Space', { delay: 4000 });
        const containerElement = await page.$('section[role=region]');
        const followingList = await containerElement
            .$$eval('.css-1dbjc4n.r-onrtq4.r-18kxxzh.r-1h0z5md.r-1b7u577',
                elements => elements.map(
                    user => user.querySelector('a').getAttribute('href')
                ));
        await browser.close();

        followingList.forEach(user => {
            uncompleteList.forEach((sub, index) => {
                if (user === sub) completeList.push(uncompleteList.splice(index, 1)[0]);
            })
        });
        return {
            subscriber: subscriber,
            userInfo: {
                avatar: avatar,
                userId: userId,
                username: username,
                completeList: completeList,
                uncompleteList: uncompleteList
            },
        };
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
                            avatar: ratingInfo.querySelector('img').getAttribute('src'),
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
        // console.log('Total Users: ', users.length);
        await browser.close();

        let userInfo;
        users.forEach(user => {
            if (user.username === username && user.comment === comment) {
                userInfo = {
                    avatar: user.avatar,
                    username: user.username,
                    rating: user.rating,
                    comment: user.comment,
                    timeRating: user.timeRating,
                }
                return;
            }
        });
        return userInfo ? userInfo : "User not Exist";
    }

    async isValidFacebookAccount(urlChannel: string, code: string) {
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        await page.setViewport({ width: 960, height: 400 });
        await page.goto(urlChannel);
        await page.waitForSelector('.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.x1vvkbs');
        const userInfoElement = await page.$('div[role="article"]');
        const avatar = await userInfoElement.$eval('object', element => element.querySelector('image').getAttribute('xlink:href'));
        const userId = urlChannel.slice(25, urlChannel.indexOf("/posts/"));
        const username = await userInfoElement.$eval('strong>span', element => element.textContent);
        const postCode = await userInfoElement.$eval('.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.x1vvkbs', element => element.textContent);
        await browser.close();

        let isValid = false;
        if (code === postCode) isValid = true;
        return {
            avatar: avatar,
            userId: userId,
            username: username,
            postCode: postCode,
            isValid: isValid
        };
    }

    async checkFacebookSubscribe(urlChannel: string, subscriber: string[]) {
        const completeList = [];
        const uncompleteList = subscriber.slice();

        const browser = await puppeteer.launch({ headless: 'new' });
        const context = browser.defaultBrowserContext();
        await context.overridePermissions(urlChannel, ['notifications']);
        const page = await browser.newPage();
        await page.setViewport({ width: 800, height: 4000 });
        /* Phần đăng nhập */
        await page.goto(urlChannel);
        await page.waitForSelector('#login_popup_cta_form');
        await (await (await page.$('#login_popup_cta_form')).$('input[name="email"]')).click();
        await page.keyboard.sendCharacter('thanhlt1521@gmail.com');
        await (await (await page.$('#login_popup_cta_form')).$('input[name="pass"]')).click();
        await page.keyboard.sendCharacter('thanh10052001!');
        await (await (await page.$('#login_popup_cta_form')).$('div[aria-label="Accessible login button"]')).click();
        await page.waitForNavigation();

        /* Phần danh sách theo dõi */
        await page.goto(urlChannel + '/following');
        await page.keyboard.press('Space', { delay: 10000 });
        const avatar = await page.$eval('.x15sbx0n.x1xy773u.x390vds.xb2vh1x.x14xzxk9.x18u1y24.xs6kywh.x5wy4b0',
            element => element.querySelector('image').getAttribute('xlink:href'));
        const username = await page.$eval('.x78zum5.xdt5ytf.x1wsgfga.x9otpla', element => element.textContent);
        const followingList = await page.$$eval('.x6s0dn4.x1lq5wgf.xgqcy7u.x30kzoy.x9jhf4c.x1olyfxc.x9f619.x78zum5.x1e56ztr.x1gefphp.x1y1aw1k.x1sxyh0.xwib8y2.xurb0ha',
            elements => elements.map(
                element => {
                    return {
                        link: element.querySelector('a').getAttribute('href'),
                        avatar: element.querySelector('img').getAttribute('src'),
                        username: element.querySelector('.x193iq5w.xeuugli.x13faqbe.x1vvkbs.x1xmvt09.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.xudqn12.x676frb').textContent,
                        description: element.querySelector('.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.x1vvkbs')?.querySelector('div').textContent,
                    }
                }
            ));
        browser.close();

        console.log('Total: ', followingList.length);
        // console.log(followingList);
        followingList.forEach(user => {
            uncompleteList.forEach((sub, index) => {
                if (user.link === sub) completeList.push(uncompleteList.splice(index, 1)[0]);
            })
        });
        return {
            subscriber: subscriber,
            userInfo: {
                avatar: avatar,
                username: username,
                completeList: completeList,
                uncompleteList: uncompleteList
            },
        };
    }

    async isValidInstagramAccount(urlChannel: string, code: string) {
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        await page.setViewport({ width: 1080, height: 960 });
        await page.goto(urlChannel);
        await page.waitForSelector('.x1qjc9v5.x78zum5.x1q0g3np.x2lah0s.x1n2onr6.x1qsaojo.xc2v4qs.x1xl8k2i.x1ez9qw7.x1kcpa7z');
        const userInfoElement = await page.$('.x1qjc9v5.x78zum5.x1q0g3np.x2lah0s.x1n2onr6.x1qsaojo.xc2v4qs.x1xl8k2i.x1ez9qw7.x1kcpa7z');
        const avatar = await userInfoElement.$eval('img', element => element.getAttribute('src'));
        const userId = await userInfoElement.$eval('h2', element => element.textContent);
        const username = await userInfoElement.$eval('.x1lliihq.x1plvlek.xryxfnj.x1n2onr6.x193iq5w.xeuugli.x1fj9vlw.x13faqbe.x1vvkbs.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x1i0vuye.xvs91rp.x1s688f', element => element.textContent);
        const description = await userInfoElement.$eval('._aacl._aaco._aacu._aacx._aad6._aade', element => element.textContent);
        await browser.close();

        let isValid = false;
        if (code === description) isValid = true;
        return {
            avatar: avatar,
            userId: userId,
            username: username,
            description: description,
            isValid: isValid
        };
    }

    async checkInstagramSubscribe(urlChannel: string, subscriber: string[]) {
        const completeList = [];
        const uncompleteList = subscriber.slice();

        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.setViewport({ width: 1080, height: 960 });
        await page.goto(`${urlChannel}/following`);
        /* Phần đăng nhập */
        /* Phần danh sách theo dõi */
        await page.waitForSelector('._aano');
        const userInfoElement = await page.$('.x1qjc9v5.x78zum5.x1q0g3np.x2lah0s.x1n2onr6.x1qsaojo.xc2v4qs.x1xl8k2i.x1ez9qw7.x1kcpa7z');
        const avatar = await userInfoElement.$eval('img', element => element.getAttribute('src'));
        const userId = await userInfoElement.$eval('h2', element => element.textContent);
        const username = await userInfoElement.$eval('.x1lliihq.x1plvlek.xryxfnj.x1n2onr6.x193iq5w.xeuugli.x1fj9vlw.x13faqbe.x1vvkbs.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x1i0vuye.xvs91rp.x1s688f', element => element.textContent);
        const description = await userInfoElement.$eval('._aacl._aaco._aacu._aacx._aad6._aade', element => element.textContent);
        const followingList = await page.$$eval('.x1dm5mii.x16mil14.xiojian.x1yutycm.x1lliihq.x193iq5w.xh8yej3', 
            elements => elements.map(
                element => {
                    return {
                        avatar: element.querySelector('._aarf').querySelector('img').getAttribute('scr'),
                        userid: element.querySelector('._aacl._aaco._aacw._aacx._aad7._aade').textContent,
                        username: element.querySelector('.x1lliihq.x193iq5w.x6ikm8r.x10wlt62.xlyipyv.xuxw1ft')?.textContent,
                    }
                }
            ));
        // browser.close();
        console.log(followingList);
        
        return {
            subscriber: subscriber,
            userInfo: {
                avatar: avatar,
                userId: userId,
                username: username,
                description: description,
                completeList: completeList,
                uncompleteList: uncompleteList
            },
        };
    }
}