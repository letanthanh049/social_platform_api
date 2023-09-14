import { Injectable } from "@nestjs/common";
import { Page } from "puppeteer";

@Injectable()
export class GoogleService {
    constructor(
        private page: Page,
        private pageWidth: any
    ) { } 

    async checkGoogleMapRating(urlLocation: string, username: string, comment: string) {
        await this.page.setViewport({ width: this.pageWidth, height: 4000 });
        await this.page.goto(urlLocation);
        await this.page.waitForSelector('.RWPxGd button:nth-child(2)');
        await this.page.click('.RWPxGd button:nth-child(2)');
        await this.page.keyboard.press('Backspace', { delay: 1000 });
        await this.page.click('button[aria-label="Sort reviews"]');
        await this.page.waitForSelector('div[role="menuitemradio"]');
        await this.page.click('.fontBodyLarge.yu5kgd>div:nth-child(2)');
        await this.page.keyboard.press('Backspace', { delay: 1000 });
        // await this.page.$eval('.m6QErb.DxyBCb.kA9KIf.dS8AEf', async element => {
        //     for (let i = 1; i <= 5; i++) {
        //         setTimeout(() => {
        //             element.scrollBy(0, element.scrollHeight + 1200);
        //             console.log("Rating is loading");
        //         }, i * 500);
        //     }
        // });
        await this.page.keyboard.press('Backspace', { delay: 3000 });
        await this.page.$$eval('button[jsaction="pane.review.showMorePhotos;keydown:pane.review.showMorePhotos;focus:pane.focusTooltip;blur:pane.blurTooltip"]',
            elements => elements.map(element => {
                element.click()
                console.log(element.innerHTML);
            })
        );
        const users = await this.page.$$eval('.jftiEf.fontBodyMedium', elements => elements.map(
            ratingInfo => {
                const regrexLink = /(https?:\/\/[^\s&]+)(?<!&quote)/g;
                let pictures = [];
                if (ratingInfo.querySelector('.KtCyie')) {
                    const str = ratingInfo.querySelector('.KtCyie').innerHTML;
                    pictures = str.match(regrexLink);
                }
                return {
                    avatar: ratingInfo.querySelector('img').getAttribute('src'),
                    username: ratingInfo.getAttribute('aria-label'),
                    rating: ratingInfo.querySelector('.kvMYJc').getAttribute('aria-label'),
                    comment: ratingInfo.querySelector('.wiI7pd')?.innerHTML.replaceAll('amp;', ''),
                    timeRating: ratingInfo.querySelector('.rsqaWe').innerHTML,
                    pictures: pictures
                }
            }
        ))
    
        console.log('Total Users: ', users.length);
        let userInfo: any = 'User not Exist!';
        users.forEach(user => {
            if (user.username === username && user.comment === comment) {
                userInfo = {
                    avatar: user.avatar,
                    username: user.username,
                    rating: user.rating,
                    comment: user.comment,
                    timeRating: user.timeRating,
                    pictures: user.pictures
                }
                return;
            }
        });
        return userInfo;
    }
}