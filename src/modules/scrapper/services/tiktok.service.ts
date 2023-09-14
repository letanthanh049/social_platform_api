import { Injectable } from "@nestjs/common";
import { Page } from "puppeteer";

@Injectable()
export class TiktokService {
    constructor(
        private page: Page,
        private pageWidth: any
    ) { } 
    
    async isValidTiktokAccount(urlChannel: string, code: string) {
        await this.page.setViewport({ width: this.pageWidth, height: 480 });
        await this.page.goto(urlChannel);
        await this.page.waitForSelector('.e1457k4r3');
        const userInfoElement = await this.page.$('.tiktok-1g04lal-DivShareLayoutHeader-StyledDivShareLayoutHeaderV2');
        const avatar = await userInfoElement.$eval('img', element => element.getAttribute('src'));
        const userId = await userInfoElement.$eval('h1[data-e2e="user-title"]', element => element.textContent);
        const username = await userInfoElement.$eval('h2[data-e2e="user-subtitle"]', element => element.textContent);
        const userBio = await userInfoElement.$eval('.e1457k4r3', element => element.textContent.trim());

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
}