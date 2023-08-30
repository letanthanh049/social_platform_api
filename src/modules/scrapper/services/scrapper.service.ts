import { Injectable, OnModuleInit } from "@nestjs/common";
import puppeteer, { Page } from "puppeteer";

@Injectable()
export class ScrapperService implements OnModuleInit {
    private pageWidth = 1360;
    private page: Page;

    async onModuleInit() {
        const browser = await puppeteer.launch({ headless: false });
        const context = browser.defaultBrowserContext();
        /**
         * Mặc định sẽ override lên toàn bộ origin nếu không set gì hết
         */
        await context.overridePermissions(undefined, ['notifications']);
        this.page = await browser.newPage();
    }

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

    async isValidTwitterAccount(urlPost: string, code: string) {
        await this.page.setViewport({ width: this.pageWidth, height: 480 });
        await this.page.goto(urlPost);
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

    async checkTwitterSubscribe(urlChannel: string, subscriber: string[]) {
        const completeList = [];
        const uncompleteList = subscriber.slice();

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

    async checkTwitterComment(urlPost: string, comment: string) {
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
        await this.page.goto(urlPost);
        await this.page.keyboard.press('Backspace', { delay: 2000 });
        await this.page.evaluate(() => {window.scrollBy(0, window.innerHeight + 2000)});
        await this.page.keyboard.press('Backspace', { delay: 2000 });
        await this.page.evaluate(() => {window.scrollBy(0, window.innerHeight + 2000)});
        await this.page.keyboard.press('Backspace', { delay: 2000 });
        const comments = await this.page.$$eval('div[class="css-1dbjc4n r-13qz1uu"] div[data-testid="cellInnerDiv"]:not(:first-child) div.css-1dbjc4n.r-16y2uox.r-1wbh5a2.r-1ny4l3l', 
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

    async isValidFacebookAccount(urlChannel: string, code: string) {
        await this.page.setViewport({ width: this.pageWidth, height: 400 });
        await this.page.goto(urlChannel);
        await this.page.waitForSelector('.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.x1vvkbs');
        const userInfoElement = await this.page.$('div[role="article"]');
        const avatar = await userInfoElement.$eval('object', element => element.querySelector('image').getAttribute('xlink:href'));
        const userId = urlChannel.slice(25, urlChannel.indexOf("/posts/"));
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

    async checkFacebookSubscribe(urlChannel: string, subscriber: string[]) {
        const completeList = [];
        const uncompleteList = subscriber.slice();

        await this.page.setViewport({ width: this.pageWidth, height: 4000 });
        /* Phần đăng nhập */
        await this.page.goto(urlChannel);
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
        await this.page.goto(urlChannel + '/following');
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
            subscriber: subscriber,
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