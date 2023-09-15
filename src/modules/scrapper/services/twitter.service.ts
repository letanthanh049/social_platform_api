import { Injectable } from "@nestjs/common";
import { Page } from "puppeteer";

@Injectable()
export class TwitterService {
    constructor(
        private page: Page,
        private pageWidth: any
    ) { } 

    async isValidTwitterAccount(urlTweet: string, code: string) {
        await this.page.setViewport({ width: this.pageWidth, height: 480 });
        await this.page.goto(urlTweet);
        await this.page.waitForSelector('div[data-testid="tweetText"]');
        await this.page.waitForSelector('.css-9pa8cd');
        const userInfoElement = await this.page.$('.css-1dbjc4n.r-18u37iz.r-15zivkp');
        const avatar = await userInfoElement.$eval('.css-9pa8cd', element => element.getAttribute('src'));
        const userId = await userInfoElement.$$eval('.css-901oao.css-16my406.r-poiln3.r-bcqeeo.r-qvutc0', elements => elements[1].textContent);
        const username = await userInfoElement.$$eval('.css-901oao.css-16my406.r-poiln3.r-bcqeeo.r-qvutc0', elements => elements[3].textContent);
        const postCode = await this.page.$eval('div[data-testid="tweetText"]', element => element.querySelector('span').textContent);

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

    async checkTwitterFollower(urlChannel: string, follower: string[]) {
        const completeList = [];
        const uncompleteList = follower.slice();

        /* Phần đăng nhập */
        await this.page.setViewport({ width: this.pageWidth, height: 9000 });
        await this.page.goto('https://twitter.com/home');
        await this.page.keyboard.press('Backspace', { delay: 1000 });
        if (this.page.url() === 'https://twitter.com/i/flow/login') {
            await this.page.waitForSelector('input[autocomplete="username"]');
            await this.page.click('input[autocomplete="username"]');
            await this.page.keyboard.sendCharacter('thanhlt1521@gmail.com');
            await this.page.keyboard.press('Enter');
            await this.page.waitForSelector('input[autocomplete="on"]');
            await this.page.click('input[autocomplete="on"]');
            await this.page.keyboard.sendCharacter('GofiberV1521');
            await this.page.keyboard.press('Enter');
            await this.page.waitForSelector('input[autocomplete="current-password"]');
            await this.page.click('input[autocomplete="current-password"]');
            await this.page.keyboard.sendCharacter('thanh10052001!');
            await this.page.keyboard.press('Enter');
            await this.page.waitForNavigation();
        }
        await this.page.keyboard.press('Backspace', { delay: 1000 });
        const userInfoElement = await this.page.$('div[aria-label="Account menu"]');
        const avatar = await userInfoElement.$eval('img', element => element.getAttribute('src'));
        const userId = await userInfoElement.$$eval('.css-901oao.css-16my406.r-poiln3.r-bcqeeo.r-qvutc0', elements => elements[1].textContent);
        const username = await userInfoElement.$$eval('.css-901oao.css-16my406.r-poiln3.r-bcqeeo.r-qvutc0', elements => elements[4].textContent);

        /* Phần danh sách theo dõi */
        await this.page.goto(urlChannel);
        await this.page.keyboard.press('Space', { delay: 2000 });
        const containerElement = await this.page.$('section[role=region]');
        const followingList = await containerElement
            .$$eval('.css-1dbjc4n.r-onrtq4.r-18kxxzh.r-1h0z5md.r-1b7u577',
                elements => elements.map(
                    user => user.querySelector('a').getAttribute('href')
                ));

        // console.log('Twitter Total Following:', followingList.length);
        // console.log('Twitter Following List:', followingList);
        followingList.forEach(user => {
            uncompleteList.forEach((sub, index) => {
                if (user === sub) completeList.push(uncompleteList.splice(index, 1)[0]);
            })
        });
        return {
            follower: follower,
            userInfo: {
                avatar: avatar,
                userId: userId,
                username: username,
                completeList: completeList,
                uncompleteList: uncompleteList
            },
        };
    }

    async checkTwitterComment(urlTweet: string, comment: string) {
        /* Phần đăng nhập */
        await this.page.setViewport({ width: 900, height: 2000 });
        await this.page.goto('https://twitter.com/home');
        await this.page.keyboard.press('Backspace', { delay: 1000 });
        if (this.page.url() === 'https://twitter.com/i/flow/login') {
            await this.page.waitForSelector('input[autocomplete="username"]');
            await this.page.click('input[autocomplete="username"]');
            await this.page.keyboard.sendCharacter('gofiberv1523@gmail.com');
            await this.page.keyboard.press('Enter');
            await this.page.waitForSelector('input[autocomplete="on"]');
            await this.page.click('input[autocomplete="on"]');
            await this.page.keyboard.sendCharacter('gofiberv1523');
            await this.page.keyboard.press('Enter');
            await this.page.waitForSelector('input[autocomplete="current-password"]');
            await this.page.click('input[autocomplete="current-password"]');
            await this.page.keyboard.sendCharacter('gofiber@12345');
            await this.page.keyboard.press('Enter');
            await this.page.waitForNavigation();
        }
        await this.page.goto(urlTweet);
        await this.page.keyboard.press('Backspace', { delay: 2000 });
        await this.page.evaluate(() => {window.scrollBy(0, window.innerHeight + 2000)});
        await this.page.keyboard.press('Backspace', { delay: 2000 });
        await this.page.evaluate(() => {window.scrollBy(0, window.innerHeight + 2000)});
        await this.page.keyboard.press('Backspace', { delay: 2000 });
        const comments = await this.page.$$eval('div[data-testid="cellInnerDiv"]:not(:first-child) article[data-testid="tweet"]', 
            comments => comments.map(
                comment => {
                    return {
                        link: 'https://twitter.com' + comment.querySelector('a').getAttribute('href'),
                        avatar: comment.querySelector('img').getAttribute('src'),
                        username: comment.querySelector('span.css-901oao.css-16my406.r-poiln3.r-bcqeeo.r-qvutc0')?.textContent,
                        userId: comment.querySelector('a').getAttribute('href').replace('/', '@'),
                        comment: comment.querySelector('div[data-testid="tweetText"]').querySelector('span')?.textContent,
                        timeComment: comment.querySelector('time')?.textContent
                    }
                }
            ));

        console.log(comments);
        console.log('Total comments: ', comments.length);
        let commentInfo = undefined;
        comments.forEach(cmt => {
            if (cmt.comment === comment) {
                commentInfo = cmt;
                return;
            }
        })
        return commentInfo;
    }
}