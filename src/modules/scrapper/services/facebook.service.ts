import { Injectable } from "@nestjs/common";
import { Page } from "puppeteer";

@Injectable()
export class FacebookService {
    constructor(
        private page: Page,
        private pageWidth: any
    ) { }

    async isValidFacebookAccount(urlProfile: string, code: string) {
        await this.page.setViewport({ width: this.pageWidth, height: 400 });
        await this.page.goto(urlProfile);
        await this.page.waitForSelector('.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.x1vvkbs');
        const userInfoElement = await this.page.$('div[role="article"]');
        const avatar = await userInfoElement.$eval('object', element => element.querySelector('image').getAttribute('xlink:href'));
        const userId = urlProfile.slice(25, urlProfile.indexOf("/posts/"));
        const username = await userInfoElement.$eval('strong>span', element => element.textContent);
        const postCode = await userInfoElement.$eval('.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.x1vvkbs', element => element.textContent);

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

    async checkFacebookFollower(urlProfile: string, follower: string[]) {
        const completeList = [];
        const uncompleteList = follower.slice();

        await this.page.setViewport({ width: this.pageWidth, height: 4000 });
        /* Phần đăng nhập */
        await this.page.goto(urlProfile);
        await this.page.keyboard.press('Backspace', { delay: 1000 });
        try {
            await this.page.$eval('#login_popup_cta_form', element => element);
            await (await (await this.page.$('#login_popup_cta_form')).$('input[name="email"]')).click();
            await this.page.keyboard.sendCharacter('thanhlt1521@gmail.com');
            await (await (await this.page.$('#login_popup_cta_form')).$('input[name="pass"]')).click();
            await this.page.keyboard.sendCharacter('thanh10052001!');
            await (await (await this.page.$('#login_popup_cta_form')).$('div[aria-label="Accessible login button"]')).click();
            await this.page.waitForNavigation();
        } catch { }

        /* Phần danh sách theo dõi */
        await this.page.goto(urlProfile + '/following');
        await this.page.keyboard.press('Space', { delay: 10000 });
        const avatar = await this.page.$eval('.x15sbx0n.x1xy773u.x390vds.xb2vh1x.x14xzxk9.x18u1y24.xs6kywh.x5wy4b0',
            element => element.querySelector('image').getAttribute('xlink:href'));
        const username = await this.page.$eval('.x78zum5.xdt5ytf.x1wsgfga.x9otpla', element => element.textContent);
        const followingList = await this.page.$$eval(':not(div[role="progressbar"])>.x6s0dn4.x1lq5wgf.xgqcy7u.x30kzoy.x9jhf4c.x1olyfxc.x9f619.x78zum5.x1e56ztr.xyamay9.x1pi30zi.x1l90r2v.x1swvt13.x1gefphp',
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

        // console.log('Facebook Total Following:', followingList.length);
        // console.log('Facebook Following List:', followingList);
        followingList.forEach(user => {
            uncompleteList.forEach((sub, index) => {
                if (user.link === sub) completeList.push(uncompleteList.splice(index, 1)[0]);
            })
        });
        return {
            follower: follower,
            userInfo: {
                avatar: avatar,
                username: username,
                completeList: completeList,
                uncompleteList: uncompleteList
            },
        };
    }
    
    async checkFacebookComment(urlPost: string, comment: string) {
        await this.page.setViewport({ width: this.pageWidth, height: 1280 });
        await this.page.goto(urlPost);
        await this.page.keyboard.press('Backspace', { delay: 3000 });
        await this.page.click('div[class="x6s0dn4 x78zum5 xdj266r x11i5rnm xat24cr x1mh8g0r xe0p6wg"]');
        await this.page.click('div[role="menuitem"]:nth-child(2)');
        await this.page.keyboard.press('Backspace', { delay: 1000 });
        await this.page.$eval('div[class="xwnonoy x1ey2m1c xg01cxk x10l6tqk x13vifvy x1k90msu x19991ni xz4gly6 xfo62xy x1p629oc"]', 
            element => element.parentElement.querySelector('span').click());
        await this.page.keyboard.press('Backspace', { delay: 2000 });
        const comments = await this.page.$$eval('div[class="x2bj2ny x12nagc"] ul li:has(div[class="xqcrz7y x14yjl9h xudhj91 x18nykt9 xww2gxu x1lliihq x1w0mnb xr9ek0c x1n2onr6"])', 
            comments => comments.map(
                comment => {
                    return {
                        link: comment.querySelector('a').getAttribute('href'),
                        avatar: comment.querySelector('image').getAttribute('xlink:href'),
                        username: comment.querySelector('span[class="x3nfvp2"]').textContent,
                        comment: comment.querySelector('div[class="xdj266r x11i5rnm xat24cr x1mh8g0r x1vvkbs"]').textContent,
                        timeComment: comment.querySelector('div[class="x6s0dn4 x3nfvp2"] a span').textContent
                    }
                }
            ));

        // console.log('Total comment: ', comments.length);
        // console.log(comments);
        let commentInfo = undefined;
        comments.forEach(cmt => {
            if (cmt.comment === comment) {
                commentInfo = cmt;
                return;
            }
        })
        return commentInfo;
    }

    async downloadFacebookVideo(urlVideo: string) {
        await this.page.setViewport({ width: this.pageWidth, height: 960 });
        await this.page.goto('https://www.facebook.com/');
        await this.page.click('input[name="email"]');
        await this.page.keyboard.sendCharacter('letanthanh049@gmail.com');
        await this.page.click('input[name="pass"]');
        await this.page.keyboard.sendCharacter('thanh10052001!');
        await this.page.click('button[type="submit"]');
        await this.page.waitForNavigation();
        const mbasicUrl = urlVideo.replace('www', 'mbasic');
        await this.page.goto(mbasicUrl);
        const newUrl = this.page.url();
        const selector = newUrl.includes('groups') ? '.bz' : '.widePic'
        const downloadLink = await this.page.$eval(selector, element => element.querySelector('a').getAttribute('href'));
        return `https://mbasic.facebook.com${downloadLink}`;
    }
}