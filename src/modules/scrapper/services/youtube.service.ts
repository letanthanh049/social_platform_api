import { Injectable } from "@nestjs/common";
import { Page } from "puppeteer";

@Injectable()
export class YoutubeService {
    constructor(
        private page: Page,
        private pageWidth: any
    ) { } 

    async isValidYoutubeAccount(urlChannel: string, code: string) {
        await this.page.setViewport({ width: this.pageWidth, height: 400 });
        await this.page.goto(urlChannel);
        await this.page.waitForSelector('#content');
        const userInfoElement = await this.page.$('#channel-header-container');
        const avatar = await userInfoElement.$eval('img', element => element.getAttribute('src'));
        const userId = await userInfoElement.$eval('yt-formatted-string[id="text"]', element => element.textContent);
        const username = await userInfoElement.$eval('yt-formatted-string[id="channel-handle"]', element => element.textContent);
        const description = await userInfoElement.$eval('div[id="content"]', element => element.textContent.trim());

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

    async checkYoutubeSubscribe(urlChannel: string, subscriber: string[]) {
        const completeList = [];
        const uncompleteList = subscriber.slice();

        await this.page.setViewport({ width: this.pageWidth, height: 10000 });
        await this.page.goto(urlChannel);
        await this.page.waitForSelector('#content');
        const userInfoElement = await this.page.$('#channel-header-container');
        const avatar = await userInfoElement.$eval('img', element => element.getAttribute('src'));
        const userId = await userInfoElement.$eval('yt-formatted-string[id="text"]', element => element.textContent);
        const username = await userInfoElement.$eval('yt-formatted-string[id="channel-handle"]', element => element.textContent);
        const description = await userInfoElement.$eval('div[id="content"]', element => element.textContent.trim());
        await this.page.keyboard.press('Backspace', { delay: 1500 });
        const channels = await this.page.$$eval('#contents #items ytd-grid-channel-renderer',
            elements => elements.map(
                channel => channel.querySelector('#channel-info').getAttribute('href')
            ));

        // console.log('Youtube Total Subscribed Channel:', followingList.length);
        // console.log('Youtube Subscribed List:', followingList);
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

    async checkYoutubeComment(urlVideo: string, comment: string) {
        await this.page.setViewport({ width: this.pageWidth, height: 2500 });
        await this.page.goto(urlVideo);
        await this.page.keyboard.press('Backspace', { delay: 4000 });
        await this.page.click('.style-scope.tp-yt-paper-menu-button');
        await this.page.keyboard.press('Backspace', { delay: 500 });
        await this.page.click('a.yt-simple-endpoint.style-scope.yt-dropdown-menu:nth-child(2)');
        await this.page.keyboard.press('Backspace', { delay: 1000 });
        const comments = await this.page.$$eval('ytd-comment-thread-renderer[class="style-scope ytd-item-section-renderer"]',
            comments => comments.map(
                comment => {
                    return {
                        link: comment.querySelector('a').getAttribute('href'),
                        avatar: comment.querySelector('img').getAttribute('src'),
                        username: comment.querySelector('#author-text>span').textContent.trim(),
                        comment: comment.querySelector('#comment-content').querySelector('#content-text').textContent,
                        timeComment: comment.querySelector('.yt-simple-endpoint.style-scope.yt-formatted-string').textContent,
                    }
                }
            ));

        console.log('Total comment', comments.length);
        console.log(comments);
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