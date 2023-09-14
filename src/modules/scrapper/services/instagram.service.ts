import { Injectable } from "@nestjs/common";
import { Page } from "puppeteer";

@Injectable()
export class InstagramService {
    constructor(
        private page: Page,
        private pageWidth: any
    ) { } 

    async isValidInstagramAccount(urlChannel: string, code: string) {
        await this.page.setViewport({ width: this.pageWidth, height: 960 });
        await this.page.goto(urlChannel);
        await this.page.waitForSelector('.x1qjc9v5.x78zum5.x1q0g3np.x2lah0s.x1n2onr6.x1qsaojo.xc2v4qs.x1xl8k2i.x1ez9qw7.x1kcpa7z');
        const userInfoElement = await this.page.$('.x1qjc9v5.x78zum5.x1q0g3np.x2lah0s.x1n2onr6.x1qsaojo.xc2v4qs.x1xl8k2i.x1ez9qw7.x1kcpa7z');
        const avatar = await userInfoElement.$eval('img', element => element.getAttribute('src'));
        const userId = await userInfoElement.$eval('h2', element => element.textContent);
        const username = await userInfoElement.$eval('.x1lliihq.x1plvlek.xryxfnj.x1n2onr6.x193iq5w.xeuugli.x1fj9vlw.x13faqbe.x1vvkbs.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x1i0vuye.xvs91rp.x1s688f', element => element.textContent);
        const description = await userInfoElement.$eval('._aacl._aaco._aacu._aacx._aad6._aade', element => element.textContent);

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

        await this.page.setViewport({ width: this.pageWidth, height: 960 });
        /* Phần đăng nhập */
        await this.page.goto('https://www.instagram.com/');
        await this.page.keyboard.press('Backspace', { delay: 1000 });
        try {
            await this.page.$eval('._ab1y', element => element);
            await this.page.waitForSelector('input[name="username"]');
            await this.page.click('input[name="username"]');
            await this.page.keyboard.sendCharacter('GofiberV1521');
            await this.page.click('input[name="password"]');
            await this.page.keyboard.sendCharacter('thanh10052001!');
            await this.page.click('button[type="submit"]');
            await this.page.waitForNavigation();
        } catch { }

        /* Phần danh sách theo dõi */
        await this.page.goto(`${urlChannel}following`);
        await this.page.keyboard.press('Space', { delay: 3000 });
        const userInfoElement = await this.page.$('.x1qjc9v5.x78zum5.x1q0g3np.x2lah0s.x1n2onr6.x1qsaojo.xc2v4qs.x1xl8k2i.x1ez9qw7.x1kcpa7z');
        const avatar = await userInfoElement.$eval('img', element => element.getAttribute('src'));
        const userId = await userInfoElement.$eval('h2', element => element.textContent);
        const username = await userInfoElement.$eval('.x1lliihq.x1plvlek.xryxfnj.x1n2onr6.x193iq5w.xeuugli.x1fj9vlw.x13faqbe.x1vvkbs.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x1i0vuye.xvs91rp.x1s688f', element => element.textContent);
        let description = undefined;
        try {
            description = await userInfoElement.$eval('._aacl._aaco._aacu._aacx._aad6._aade', element => element.textContent);
        } catch (error) {
            console.log(error);
        }
        await this.page.$eval('._aano', async element => {
            for (let i = 1; i <= 10; i++) {
                if (i == 1 || i == 2)
                    setTimeout(() => {
                        element.scrollBy(0, 1200);
                    }, i * 500);
                setTimeout(() => {
                    element.scrollBy(0, 800);
                }, i * 800);
            }
        });
        await this.page.keyboard.press('Backspace', { delay: 9000 })
        const followingList = await this.page.$$eval('.x1dm5mii.x16mil14.xiojian.x1yutycm.x1lliihq.x193iq5w.xh8yej3',
            elements => elements.map(
                element => {
                    return {
                        link: element.querySelector('a').getAttribute('href'),
                        avatar: element.querySelector('img').getAttribute('src'),
                        userid: element.querySelector('._aacl._aaco._aacw._aacx._aad7._aade').textContent,
                        username: element.querySelector('.x1lliihq.x193iq5w.x6ikm8r.x10wlt62.xlyipyv.xuxw1ft')?.textContent,
                    };
                }
            ));

        // console.log('Instagram Total Following:', followingList.length);
        // console.log('Instagram Following List:', followingList);
        followingList.forEach(following => {
            uncompleteList.forEach((sub, index) => {
                if (following.link === sub) completeList.push(uncompleteList.splice(index, 1)[0]);
            })
        })
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

    async checkInstagramComment(urlPost: string, comment: string) {
        await this.page.setViewport({ width: this.pageWidth, height: 900 });
        await this.page.goto(urlPost);
        return comment;
    }
}